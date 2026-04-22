import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SiteConfig, DEFAULT_SITE_CONFIG, PRESETS, COLOR_PALETTES, FONT_OPTIONS, GOOGLE_FONTS_BASE, ThemeMode } from "@/types/site-config";
import type { PaletteColors } from "@/types/site-config";
import { configService } from "@/services/configService";
import { useTheme } from "@/components/theme-provider";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetToDefault: () => void;
  applyPreset: (presetName: string) => void;
  isSyncing: boolean;
  refreshConfig: () => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

// ── Module-level state for original token capture ───────────────────
let originalTokensCaptured = false;

const CSS_TOKEN_KEYS = [
  "--background", "--foreground", "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
  "--accent", "--accent-foreground", "--card", "--border", "--ring",
];

const GLASS_KEYS = [
  "--glass-bg", "--glass-border", "--glass-shadow", "--glass-highlight", "--background-scrim",
];

/** Capture original CSS variable values (effectively just a flag now as we use style.removeProperty) */
function captureOriginalTokens() {
  if (originalTokensCaptured) return;
  originalTokensCaptured = true;
}

// ── Hex-to-HSL conversion ───────────────────────────────────────────

function hexToHSL(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s: number, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToRGB(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function blendHex(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRGB(a);
  const [r2, g2, b2] = hexToRGB(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRGB(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Derive full CSS token map from 5 palette core colors */
function deriveCSSTokens(colors: PaletteColors, isDark: boolean): Record<string, string> {
  const cardColor = blendHex(colors.bg, colors.surface, 0.35);
  const borderColor = blendHex(colors.surface, colors.muted, 0.35);
  const accentFg = luminance(colors.accent) > 0.5 ? colors.text : colors.bg;

  const tokens: Record<string, string> = {
    "--background": hexToHSL(colors.bg),
    "--foreground": hexToHSL(colors.text),
    "--primary": hexToHSL(colors.text),
    "--primary-foreground": hexToHSL(colors.bg),
    "--secondary": hexToHSL(colors.surface),
    "--secondary-foreground": hexToHSL(colors.text),
    "--muted": hexToHSL(colors.surface),
    "--muted-foreground": hexToHSL(colors.muted),
    "--accent": hexToHSL(colors.accent),
    "--accent-foreground": hexToHSL(accentFg),
    "--card": hexToHSL(cardColor),
    "--border": hexToHSL(borderColor),
    "--ring": hexToHSL(colors.accent),
  };

  // Glass variables
  if (isDark) {
    tokens["--glass-bg"] = "rgba(255, 255, 255, 0.06)";
    tokens["--glass-border"] = "rgba(255, 255, 255, 0.12)";
    tokens["--glass-shadow"] = "rgba(0, 0, 0, 0.5)";
    tokens["--glass-highlight"] = "rgba(255, 255, 255, 0.05)";
    tokens["--background-scrim"] = "rgba(0, 0, 0, 0.55)";
  } else {
    tokens["--glass-bg"] = "rgba(255, 255, 255, 0.12)";
    tokens["--glass-border"] = "rgba(255, 255, 255, 0.15)";
    tokens["--glass-shadow"] = "rgba(0, 0, 0, 0.05)";
    tokens["--glass-highlight"] = "rgba(255, 255, 255, 0.1)";
    tokens["--background-scrim"] = "rgba(255, 255, 255, 0.4)";
  }

  return tokens;
}

// ── Google Font loader ──────────────────────────────────────────────

const FONT_LINK_ID = "portfolio-dynamic-font";

function loadGoogleFont(importParam: string) {
  // Remove existing dynamic font link
  const existing = document.getElementById(FONT_LINK_ID);
  if (existing) existing.remove();

  if (!importParam) return;

  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href = `${GOOGLE_FONTS_BASE}${importParam}&display=swap`;
  document.head.appendChild(link);
}

function removeGoogleFont() {
  const existing = document.getElementById(FONT_LINK_ID);
  if (existing) existing.remove();
}

// ── Provider ────────────────────────────────────────────────────────

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(configService.getLocalConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const { setTheme } = useTheme();
  const capturedRef = useRef(false);

  // Resolve the effective dark/light state by checking the actual DOM class
  // This allows ThemeProvider to be the source of truth for the theme class
  const resolveIsDark = useCallback((): boolean => {
    const root = document.documentElement;
    // Check the actual dark/light class from ThemeProvider
    if (root.classList.contains("dark")) return true;
    if (root.classList.contains("light")) return false;
    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  // Apply palette tokens to the DOM
  const applyPaletteToDOM = useCallback((paletteId: string, isDark: boolean) => {
    const root = document.documentElement;

    if (paletteId === "original") {
      // Remove all inline palette overrides → let CSS cascade handle it
      const allKeys = [...CSS_TOKEN_KEYS, ...GLASS_KEYS];
      for (const key of allKeys) {
        root.style.removeProperty(key);
      }
      return;
    }

    const palette = COLOR_PALETTES.find((p) => p.id === paletteId);
    if (!palette) return;

    const colors = isDark ? palette.dark : palette.light;
    const tokens = deriveCSSTokens(colors, isDark);

    for (const [key, value] of Object.entries(tokens)) {
      root.style.setProperty(key, value);
    }
  }, []);

  // Apply font to the DOM
  const applyFontToDOM = useCallback((fontId: string) => {
    const root = document.documentElement;

    if (fontId === "original") {
      // Remove font overrides
      removeGoogleFont();
      root.style.removeProperty("--font-sans");
      root.style.removeProperty("--font-display");
      document.body.style.removeProperty("font-family");
      return;
    }

    const font = FONT_OPTIONS.find((f) => f.id === fontId);
    if (!font) return;

    loadGoogleFont(font.importParam);
    root.style.setProperty("--font-sans", font.family);
    root.style.setProperty("--font-display", font.family);
    document.body.style.fontFamily = font.family;
  }, []);
  
  // Apply theme class to DOM
  const applyThemeToDOM = useCallback((themeMode: ThemeMode) => {
    // Sync with ThemeProvider state (which also updates DOM and localStorage)
    setTheme(themeMode);
  }, [setTheme]);

  // Apply all config to DOM
  const applyConfigToDOM = useCallback((newConfig: SiteConfig) => {
    const root = document.documentElement;
    
    // Apply theme mode if provided
    if (newConfig.themeMode) {
      applyThemeToDOM(newConfig.themeMode);
    }

    // Get the current theme from the DOM (managed by ThemeProvider or our own setter)
    const isDark = resolveIsDark();

    // Apply palette (this sets all color CSS variables)
    applyPaletteToDOM(newConfig.selectedPalette || "original", isDark);

    // Apply font
    applyFontToDOM(newConfig.selectedFont || "original");

    // If palette is "original", also apply accentColor for backward compat
    if (newConfig.selectedPalette === "original") {
      root.style.setProperty("--accent", hexToHSL(newConfig.accentColor));
      root.style.setProperty("--primary", isDark ? "0 0% 96%" : "240 6% 4%");
    }

    // Radius
    const radiusMap: Record<string, string> = {
      none: "0px", small: "0.25rem", normal: "0.5rem", rounded: "1rem", pill: "9999px",
    };
    root.style.setProperty("--radius", radiusMap[newConfig.radius]);

    // Scroll
    root.style.setProperty("--scroll-behavior", newConfig.smoothScroll ? "smooth" : "auto");

    // Effects & Visibility
    root.style.setProperty("--hover-effects", newConfig.hoverEffects ? "1" : "0");
    root.style.setProperty("--motion-level", newConfig.motionLevel);

    // Glass/Blur (only override if palette is original — palettes handle their own glass values)
    if (newConfig.selectedPalette === "original") {
      if (newConfig.glassEffect) {
        root.style.setProperty("--glass-bg", isDark
          ? `rgba(255, 255, 255, ${newConfig.transparencyLevel / 2})`
          : `rgba(255, 255, 255, ${newConfig.transparencyLevel})`
        );
        root.style.setProperty("--glass-border", `rgba(255, 255, 255, ${newConfig.transparencyLevel + 0.05})`);
      } else {
        root.style.setProperty("--glass-bg", isDark ? "hsl(240 4% 10%)" : "hsl(0 0% 100%)");
        root.style.setProperty("--glass-border", "hsl(var(--border))");
      }
    }

    if (newConfig.blurEffects) {
      root.style.setProperty("--blur-intensity", `${newConfig.blurIntensity}px`);
    } else {
      root.style.setProperty("--blur-intensity", "0px");
    }

    // Scaling
    root.style.setProperty("--animation-speed-scale", `${newConfig.animationSpeed}`);
    root.style.setProperty("--section-padding-scale", `${newConfig.sectionPaddingScale}`);

    // Contrast
    if (newConfig.contrastBoost) {
      root.style.setProperty("--contrast-multiplier", "1.2");
      root.classList.add("contrast-boost");
    } else {
      root.style.setProperty("--contrast-multiplier", "1");
      root.classList.remove("contrast-boost");
    }

    // Card Style
    root.setAttribute("data-card-style", newConfig.cardStyle);
  }, [resolveIsDark, applyPaletteToDOM, applyFontToDOM]);

  // Capture original tokens on first mount (before any palette is applied)
  useEffect(() => {
    if (!capturedRef.current) {
      captureOriginalTokens();
      capturedRef.current = true;
    }
  }, []);

  // Initial local load and remote sync
  useEffect(() => {
    applyConfigToDOM(config);

    // Subscribe to remote changes
    const unsubscribe = configService.subscribeToConfig((remoteConfig) => {
      console.log("🔄 SiteConfigContext: Remote config update received", remoteConfig);
      setConfig(remoteConfig);
      configService.saveLocalConfig(remoteConfig);
      applyConfigToDOM(remoteConfig);
    });

    return () => unsubscribe();
  }, [applyConfigToDOM]);

  const refreshConfig = async () => {
    setIsSyncing(true);
    try {
      const remoteConfig = await configService.getRemoteConfig();
      if (remoteConfig) {
        setConfig(remoteConfig);
        configService.saveLocalConfig(remoteConfig);
        applyConfigToDOM(remoteConfig);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Listen for theme changes (from ThemeProvider) to re-apply palette
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      // When dark/light class changes, re-apply config with new theme
      applyConfigToDOM(config);
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [config, applyConfigToDOM]);

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);

    // If theme mode changed, apply it via ThemeProvider
    if (updates.themeMode) {
      applyThemeToDOM(updates.themeMode);
    }

    applyConfigToDOM(newConfig);
    configService.saveLocalConfig(newConfig);

    // Persist to Firestore
    setIsSyncing(true);
    try {
      await configService.updateRemoteConfig(newConfig);
    } catch (error) {
      console.error("Failed to sync config:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const resetToDefault = () => {
    updateConfig(DEFAULT_SITE_CONFIG);
  };

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName];
    if (preset) {
      updateConfig(preset);
    }
  };

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetToDefault, applyPreset, isSyncing, refreshConfig }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }
  return context;
};
