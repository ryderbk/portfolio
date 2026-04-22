import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SiteConfig, DEFAULT_SITE_CONFIG, PRESETS, COLOR_PALETTES, FONT_OPTIONS, GOOGLE_FONTS_BASE } from "@/types/site-config";
import type { PaletteColors } from "@/types/site-config";
import { configService } from "@/services/configService";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetToDefault: () => void;
  applyPreset: (presetName: string) => void;
  isSyncing: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

// ── Module-level state for original token capture ───────────────────
let originalLightTokens: Record<string, string> | null = null;

const CSS_TOKEN_KEYS = [
  "--background", "--foreground", "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
  "--accent", "--accent-foreground", "--card", "--border", "--ring",
];

const GLASS_KEYS = [
  "--glass-bg", "--glass-border", "--glass-shadow", "--glass-highlight", "--background-scrim",
];

/** Capture original CSS variable values from the stylesheet (before any inline overrides) */
function captureOriginalTokens() {
  if (originalLightTokens) return; // already captured

  const root = document.documentElement;
  const wasLight = root.classList.contains("light") || !root.classList.contains("dark");

  // Capture current mode tokens
  const captureCurrentTokens = (): Record<string, string> => {
    const style = getComputedStyle(root);
    const tokens: Record<string, string> = {};
    for (const key of [...CSS_TOKEN_KEYS, ...GLASS_KEYS]) {
      tokens[key] = style.getPropertyValue(key).trim();
    }
    return tokens;
  };

  if (wasLight) {
    originalLightTokens = captureCurrentTokens();
    // Temporarily switch to dark to capture dark tokens
    root.classList.remove("light");
    root.classList.add("dark");
    // Force style recalc
    void getComputedStyle(root).getPropertyValue("--background");
    captureCurrentTokens();
    // Switch back
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    captureCurrentTokens();
    root.classList.remove("dark");
    root.classList.add("light");
    void getComputedStyle(root).getPropertyValue("--background");
    originalLightTokens = captureCurrentTokens();
    root.classList.remove("light");
    root.classList.add("dark");
  }

  // Capture original font
  getComputedStyle(document.body).fontFamily || "'Inter', system-ui, sans-serif";
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
  const borderColor = blendHex(colors.surface, colors.muted, 0.45);
  
  // Visibility: In dark mode, colors.text is light and colors.bg is dark.
  // We want the foreground on the accent to have high contrast.
  const accentFg = isDark 
    ? (luminance(colors.accent) > 0.45 ? colors.bg : colors.text)
    : (luminance(colors.accent) > 0.5 ? colors.text : colors.bg);

  const tokens: Record<string, string> = {
    "--background": hexToHSL(colors.bg),
    "--foreground": hexToHSL(colors.text),
    "--primary": hexToHSL(colors.text),
    "--primary-foreground": hexToHSL(colors.bg),
    "--secondary": hexToHSL(colors.surface),
    "--secondary-foreground": hexToHSL(colors.text),
    "--muted": hexToHSL(colors.surface),
    "--muted-foreground": isDark && luminance(colors.muted) < 0.45 ? "240 5% 75%" : hexToHSL(colors.muted),
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
    // Light mode: use dark-ish semi-transparent borders for better visibility
    tokens["--glass-bg"] = "rgba(255, 255, 255, 0.4)";
    tokens["--glass-border"] = "rgba(0, 0, 0, 0.08)";
    tokens["--glass-shadow"] = "rgba(0, 0, 0, 0.05)";
    tokens["--glass-highlight"] = "rgba(255, 255, 255, 0.5)";
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
  const capturedRef = useRef(false);

  // Resolve the effective dark/light state
  const resolveIsDark = useCallback((mode: string): boolean => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
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
    const STYLE_ID = "dynamic-global-font";
    
    // Remove existing dynamic font style tag if it exists
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) existingStyle.remove();

    if (fontId === "original") {
      removeGoogleFont();
      root.style.removeProperty("--font-family-sans");
      root.style.removeProperty("--font-family-display");
      root.style.removeProperty("--font-family-projects");
      root.style.removeProperty("--font-sans");
      root.style.removeProperty("--font-display");
      root.style.removeProperty("--font-projects");
      document.body.style.removeProperty("font-family");
      // Reset typographic variables
      root.style.removeProperty("--font-body-line-height");
      root.style.removeProperty("--font-body-letter-spacing");
      root.style.removeProperty("--font-body-scale");
      root.style.removeProperty("--font-heading-scale");
      root.style.removeProperty("--font-heading-letter-spacing");
      root.style.removeProperty("--font-heading-line-height");
      return;
    }

    const font = FONT_OPTIONS.find((f) => f.id === fontId);
    if (!font) return;

    loadGoogleFont(font.importParam);
    const fontValue = font.family;
    
    // 1. Update root CSS font-family variables with high priority
    root.style.setProperty("--font-family-sans", fontValue, "important");
    root.style.setProperty("--font-family-display", fontValue, "important");
    root.style.setProperty("--font-family-projects", fontValue, "important");
    root.style.setProperty("--font-sans", fontValue, "important");
    root.style.setProperty("--font-display", fontValue, "important");
    root.style.setProperty("--font-projects", fontValue, "important");

    // 2. Apply per-font typographic CSS variables
    root.style.setProperty("--font-body-line-height",       font.lineHeight            ?? "1.6");
    root.style.setProperty("--font-body-letter-spacing",    font.letterSpacing         ?? "0em");
    root.style.setProperty("--font-body-scale",             String(font.bodyScale      ?? 1));
    root.style.setProperty("--font-heading-scale",          String(font.headingScale   ?? 1));
    root.style.setProperty("--font-heading-letter-spacing", font.headingLetterSpacing  ?? "-0.02em");
    root.style.setProperty("--font-heading-line-height",    font.headingLineHeight     ?? "1.1");
    
    // 3. Inject an absolute override style tag
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      /* Extreme reset for all text-bearing elements and Tailwind font classes */
      *, .font-sans, .font-display, .font-projects, [class*="font-"] {
        font-family: ${fontValue} !important;
      }
      /* Protect monospace elements */
      code, pre, kbd, samp, .font-mono {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
      }
      /* Apply per-font body spacing */
      body {
        line-height: var(--font-body-line-height, 1.6) !important;
        letter-spacing: var(--font-body-letter-spacing, 0em) !important;
        font-size: calc(1rem * var(--font-body-scale, 1)) !important;
      }
      /* Apply per-font heading metrics */
      h1, h2, h3, h4, h5, h6 {
        letter-spacing: var(--font-heading-letter-spacing, -0.02em) !important;
        line-height: var(--font-heading-line-height, 1.1) !important;
      }
    `;
    document.head.appendChild(style);
    
    // 4. Direct body fallback
    document.body.style.setProperty("font-family", fontValue, "important");
  }, []);

  // Apply all config to DOM
  const applyConfigToDOM = useCallback((newConfig: SiteConfig) => {
    const root = document.documentElement;
    const isDark = resolveIsDark(newConfig.themeMode);

    // Theme class
    root.classList.remove("light", "dark");
    root.classList.add(isDark ? "dark" : "light");

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
      none: "0px", small: "0.25rem", normal: "0.5rem", rounded: "1rem",
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
        root.style.setProperty("--glass-border", isDark 
          ? `rgba(255, 255, 255, ${newConfig.transparencyLevel + 0.15})`
          : `rgba(0, 0, 0, 0.1)`
        );
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

    // Shadow Intensity
    let shadowValue = "0 8px 30px rgba(0, 0, 0, 0.08)";
    if (newConfig.shadow === "none") {
      shadowValue = "none";
    } else if (newConfig.shadow === "soft") {
      shadowValue = "0 4px 12px rgba(0, 0, 0, 0.05)";
    } else if (newConfig.shadow === "medium") {
      shadowValue = "0 8px 30px rgba(0, 0, 0, 0.08)";
    } else if (newConfig.shadow === "strong") {
      shadowValue = "0 20px 60px rgba(0, 0, 0, 0.18)";
    }
    
    const finalShadow = isDark && shadowValue !== "none"
      ? shadowValue.replace(/rgba\(0, 0, 0, ([\d.]+)\)/g, "rgba(0, 0, 0, 0.45)")
      : shadowValue;
    
    root.style.setProperty("--base-shadow", finalShadow);

    // Card Style
    root.setAttribute("data-card-style", newConfig.cardStyle);

    // Save compiled state for instant load (FOUC prevention)
    localStorage.setItem('portfolio-css-text', root.style.cssText);
    localStorage.setItem('portfolio-css-classes', root.className);
    localStorage.setItem('portfolio-card-style', newConfig.cardStyle);
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
      setConfig(remoteConfig);
      configService.saveLocalConfig(remoteConfig);
      applyConfigToDOM(remoteConfig);
    });

    return () => unsubscribe();
  }, [applyConfigToDOM]);

  // Listen for system theme changes to re-apply palette
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (config.themeMode === "system") {
        applyConfigToDOM(config);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [config, applyConfigToDOM]);

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
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
    <SiteConfigContext.Provider value={{ config, updateConfig, resetToDefault, applyPreset, isSyncing }}>
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
