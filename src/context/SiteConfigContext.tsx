import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SiteConfig, DEFAULT_SITE_CONFIG, DEFAULT_PALETTE_ID, normalizeConfig, PRESETS, COLOR_PALETTES, FONT_OPTIONS, GOOGLE_FONTS_BASE } from "@/types/site-config";
import type { PaletteColors } from "@/types/site-config";
import { configService } from "@/services/configService";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetToDefault: () => void;
  applyPreset: (presetName: string) => void;
  isSyncing: boolean;
  /** Effective light/dark state actually shown (admin default + this browser's override) */
  resolvedTheme: "light" | "dark";
  /** Light/dark chosen from the website toggle in this browser (null = following the admin default) */
  visitorTheme: "light" | "dark" | null;
  /** Switch light/dark from the website toggle (stored per browser, synced with the admin panel UI) */
  toggleTheme: () => void;
  setTheme: (mode: "light" | "dark") => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

const CSS_TOKEN_KEYS = [
  "--background", "--foreground", "--primary", "--primary-foreground",
  "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
  "--accent", "--accent-foreground", "--card", "--border", "--ring",
];

const GLASS_KEYS = [
  "--glass-bg", "--glass-border", "--glass-shadow", "--glass-highlight", "--background-scrim",
];

const CIN_KEYS = [
  "--cin-bg", "--cin-bg-2", "--cin-fg", "--cin-mute", "--cin-faint", "--cin-line",
  "--cin-acc", "--cin-acc-ink", "--cin-bg-rgb", "--cin-bg2-rgb", "--cin-fg-rgb",
  "--cin-acc-rgb", "--cin-scrim-rgb",
  ...CSS_TOKEN_KEYS.map((k) => `--cin-h-${k.slice(2)}`),
];

const VISITOR_THEME_KEY = "portfolio-visitor-theme";

type VisitorTheme = { mode: "light" | "dark"; stamp: number };

function readVisitorTheme(): VisitorTheme | null {
  try {
    const v = JSON.parse(localStorage.getItem(VISITOR_THEME_KEY) || "null");
    if (v && (v.mode === "light" || v.mode === "dark")) return { mode: v.mode, stamp: Number(v.stamp) || 0 };
  } catch { /* ignore */ }
  return null;
}

function writeVisitorTheme(v: VisitorTheme | null) {
  try {
    if (v) localStorage.setItem(VISITOR_THEME_KEY, JSON.stringify(v));
    else localStorage.removeItem(VISITOR_THEME_KEY);
  } catch { /* ignore */ }
}

/** Remove scroll-lock leftovers (inline overflow, Lenis classes) so they are never persisted or restored */
export function sanitizeRootScrollState() {
  const root = document.documentElement;
  root.style.removeProperty("overflow");
  root.style.removeProperty("overflow-y");
  root.classList.remove("lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling");
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

function relLuminance(hex: string): number {
  const [r8, g8, b8] = hexToRGB(hex);
  const toLinear = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r8) + 0.7152 * toLinear(g8) + 0.0722 * toLinear(b8);
}

function contrast(hexA: string, hexB: string): number {
  const l1 = relLuminance(hexA);
  const l2 = relLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
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

/** Derive the website (.cin) variables from palette colours with contrast guards. */
function deriveCinTokens(colors: PaletteColors, isDark: boolean): Record<string, string> {
  const [fr, fg, fb] = hexToRGB(colors.text);
  const [br, bg, bb] = hexToRGB(colors.bg);
  const [sr, sg, sb] = hexToRGB(colors.surface);

  // 1. Nudge accent toward text color until contrast against bg is at least 3.5:1
  let guardedAccent = colors.accent;
  let accentStep = 0;
  while (contrast(guardedAccent, colors.bg) < 3.5 && accentStep < 15) {
    accentStep++;
    guardedAccent = blendHex(guardedAccent, colors.text, 0.08);
  }
  const [ar, ag, ab] = hexToRGB(guardedAccent);

  // 2. Pick black or white --acc-ink, whichever contrasts more with the accent
  const blackContrast = contrast(guardedAccent, "#000000");
  const whiteContrast = contrast(guardedAccent, "#ffffff");
  const accInk = blackContrast >= whiteContrast ? "#0a0b04" : "#ffffff";

  // 3. Raise muted alpha until text on bg reaches at least 4.5:1 contrast
  let muteAlpha = isDark ? 0.56 : 0.65;
  let muteStep = 0;
  while (contrast(blendHex(colors.bg, colors.text, muteAlpha), colors.bg) < 4.5 && muteAlpha < 0.96 && muteStep < 20) {
    muteStep++;
    muteAlpha += 0.03;
  }
  muteAlpha = Math.min(0.96, Math.round(muteAlpha * 100) / 100);

  const t: Record<string, string> = {
    "--cin-bg": colors.bg,
    "--cin-bg-2": colors.surface,
    "--cin-fg": colors.text,
    "--cin-mute": `rgba(${fr}, ${fg}, ${fb}, ${muteAlpha})`,
    "--cin-faint": `rgba(${fr}, ${fg}, ${fb}, 0.3)`,
    "--cin-line": `rgba(${fr}, ${fg}, ${fb}, ${isDark ? 0.12 : 0.16})`,
    "--cin-acc": guardedAccent,
    "--cin-acc-ink": accInk,
    "--cin-bg-rgb": `${br}, ${bg}, ${bb}`,
    "--cin-bg2-rgb": `${sr}, ${sg}, ${sb}`,
    "--cin-fg-rgb": `${fr}, ${fg}, ${fb}`,
    "--cin-acc-rgb": `${ar}, ${ag}, ${ab}`,
    "--cin-scrim-rgb": isDark ? "4, 4, 6" : "20, 20, 24",
    "--cin-shadow": isDark ? "0 8px 30px rgba(0, 0, 0, 0.5)" : "0 8px 30px rgba(20, 20, 30, 0.14)",
  };
  for (const [k, v] of Object.entries(deriveCSSTokens(colors, isDark))) {
    if (k.startsWith("--glass") || k === "--background-scrim") continue;
    t[`--cin-h-${k.slice(2)}`] = v;
  }
  return t;
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
  const [config, setConfig] = useState<SiteConfig>(() => normalizeConfig(configService.getLocalConfig()));
  const [isSyncing, setIsSyncing] = useState(false);

  // Resolve the effective dark/light state
  const resolveIsDark = useCallback((mode: string): boolean => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  // Apply palette tokens to the DOM (admin tokens + website --cin-* tokens)
  const applyPaletteToDOM = useCallback((paletteId: string, isDark: boolean) => {
    const root = document.documentElement;
    const palette = COLOR_PALETTES.find((p) => p.id === paletteId) ||
      COLOR_PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID)!;

    for (const key of [...CSS_TOKEN_KEYS, ...GLASS_KEYS, ...CIN_KEYS, "--cin-shadow"]) {
      root.style.removeProperty(key);
    }

    const colors = isDark ? palette.dark : palette.light;
    for (const [key, value] of Object.entries(deriveCSSTokens(colors, isDark))) {
      root.style.setProperty(key, value);
    }

    // Cinema in dark mode = the untouched original design: rely on the CSS defaults in cinema.css.
    if (palette.id === DEFAULT_PALETTE_ID && isDark) return;

    for (const [key, value] of Object.entries(deriveCinTokens(colors, isDark))) {
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
      root.setAttribute("data-font", "original");
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

    root.setAttribute("data-font", fontId);
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
  const applyConfigToDOM = useCallback((newConfig: SiteConfig, mode?: string) => {
    const root = document.documentElement;
    const isDark = resolveIsDark(mode || newConfig.themeMode);

    // Theme class
    root.classList.remove("light", "dark");
    root.classList.add(isDark ? "dark" : "light");

    // Apply palette (this sets all color CSS variables)
    applyPaletteToDOM(newConfig.selectedPalette || "original", isDark);

    // Apply font
    applyFontToDOM(newConfig.selectedFont || "original");

    root.style.colorScheme = isDark ? "dark" : "light";
    root.setAttribute("data-theme", isDark ? "dark" : "light");

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
    // (scroll-lock leftovers such as inline overflow / Lenis classes must never be persisted)
    try {
      const css = root.style.cssText.replace(/overflow(-[xy])?\s*:[^;]*;?/g, "").trim();
      const classes = root.className.split(/\s+/).filter((c) => c && !c.startsWith("lenis")).join(" ");
      localStorage.setItem('portfolio-css-text', css);
      localStorage.setItem('portfolio-css-classes', classes);
      localStorage.setItem('portfolio-card-style', newConfig.cardStyle);
    } catch { /* storage unavailable */ }
  }, [resolveIsDark, applyPaletteToDOM, applyFontToDOM]);

  const [visitor, setVisitor] = useState<VisitorTheme | null>(readVisitorTheme);
  const configRef = useRef(config);
  configRef.current = config;
  const visitorRef = useRef(visitor);
  visitorRef.current = visitor;

  // Visitor override only counts while it was made against the current admin theme stamp
  const effectiveMode = (cfg: SiteConfig, v: VisitorTheme | null): string =>
    v && v.stamp === cfg.themeStamp ? v.mode : cfg.themeMode;

  const resolvedTheme: "light" | "dark" = resolveIsDark(effectiveMode(config, visitor)) ? "dark" : "light";
  const visitorTheme = visitor && visitor.stamp === config.themeStamp ? visitor.mode : null;

  // Re-apply whenever config or the visitor override changes
  useEffect(() => {
    applyConfigToDOM(config, effectiveMode(config, visitor));
  }, [config, visitor, applyConfigToDOM]);

  // Fit-to-screen (16:9) viewport scaling
  useEffect(() => {
    const root = document.documentElement;
    if (config.fitViewport === false) {
      root.removeAttribute("data-fit");
      root.style.removeProperty("--fit");
      return;
    }
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w >= 900 && w > h) {
        root.setAttribute("data-fit", "on");
        const idealH = (w * 9) / 16;
        const scale = Math.max(0.55, Math.min(1, h / idealH));
        root.style.setProperty("--fit", scale.toFixed(4));
      } else {
        root.removeAttribute("data-fit");
        root.style.removeProperty("--fit");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      root.removeAttribute("data-fit");
      root.style.removeProperty("--fit");
    };
  }, [config.fitViewport]);

  // Remote (admin) changes → website, live
  useEffect(() => {
    const unsubscribe = configService.subscribeToConfig((remoteConfig) => {
      setConfig(remoteConfig);
      configService.saveLocalConfig(remoteConfig);
    });
    return () => unsubscribe();
  }, []);

  // Other tabs (admin tab ⇄ website tab in the same browser) stay in sync instantly
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === VISITOR_THEME_KEY) setVisitor(readVisitorTheme());
      if (e.key === "site-config") setConfig(configService.getLocalConfig());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Follow the OS when mode is "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (effectiveMode(configRef.current, visitorRef.current) === "system") {
        applyConfigToDOM(configRef.current, "system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [applyConfigToDOM]);

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    const next: SiteConfig = { ...configRef.current, ...updates };
    if (updates.themeMode) {
      // Admin explicitly chose a theme: it wins over any local website-toggle override
      next.themeStamp = Date.now();
      writeVisitorTheme(null);
      setVisitor(null);
    }
    configRef.current = next;
    setConfig(next);
    configService.saveLocalConfig(next);

    // Persist to Firestore
    setIsSyncing(true);
    try {
      await configService.updateRemoteConfig(next);
    } catch (error) {
      console.error("Failed to sync config:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const resetToDefault = () => {
    updateConfig({ ...DEFAULT_SITE_CONFIG, themeStamp: Date.now() });
    writeVisitorTheme(null);
    setVisitor(null);
  };

  const applyPreset = (presetName: string) => {
    const preset = PRESETS[presetName];
    if (preset) {
      updateConfig(preset);
    }
  };

  const setTheme = (mode: "light" | "dark") => {
    const v = { mode, stamp: configRef.current.themeStamp };
    writeVisitorTheme(v);
    setVisitor(v);
  };

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <SiteConfigContext.Provider value={{ config, updateConfig, resetToDefault, applyPreset, isSyncing, resolvedTheme, visitorTheme, toggleTheme, setTheme }}>
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
