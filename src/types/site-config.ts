export type ThemeMode = "dark" | "light" | "system";
export type StyleVariant = "minimal" | "modern" | "glass" | "premium";
export type RadiusSize = "none" | "small" | "normal" | "rounded";
export type ShadowIntensity = "none" | "soft" | "medium" | "strong";
export type SpacingDensity = "compact" | "normal" | "spacious";
export type MotionLevel = "off" | "subtle" | "normal" | "high";
export type CardStyle = "flat" | "elevated" | "outlined" | "glass";

export interface SiteConfig {
  themeMode: ThemeMode;
  styleVariant: StyleVariant;
  accentColor: string;
  fontFamily: string;
  radius: RadiusSize;
  shadow: ShadowIntensity;
  spacing: SpacingDensity;
  motionLevel: MotionLevel;
  backgroundAnimation: boolean;
  scrollAnimation: boolean;
  hoverEffects: boolean;
  chatbotVisibility: boolean;
  smoothScroll: boolean;
  glassEffect: boolean;
  blurEffects: boolean;
  blurIntensity: number; // 0 to 40
  transparencyLevel: number; // 0 to 1
  contrastBoost: boolean;
  animationSpeed: number; // 0.5 to 2
  sectionPaddingScale: number; // 0.5 to 2
  cardStyle: CardStyle;
  selectedPalette: string;
  selectedFont: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  themeMode: "light",
  styleVariant: "modern",
  accentColor: "#6366f1", // Indigo 500
  fontFamily: "Inter, sans-serif",
  radius: "rounded",
  shadow: "soft",
  spacing: "normal",
  motionLevel: "normal",
  backgroundAnimation: true,
  scrollAnimation: true,
  hoverEffects: true,
  chatbotVisibility: true,
  smoothScroll: true,
  glassEffect: true,
  blurEffects: true,
  blurIntensity: 20,
  transparencyLevel: 0.12,
  contrastBoost: false,
  animationSpeed: 1,
  sectionPaddingScale: 1,
  cardStyle: "glass",
  selectedPalette: "original",
  selectedFont: "original",
};

export const PRESETS: Record<string, Partial<SiteConfig>> = {
  minimal: {
    styleVariant: "minimal",
    radius: "small",
    shadow: "none",
    glassEffect: false,
    blurEffects: false,
    backgroundAnimation: false,
    accentColor: "#000000",
    cardStyle: "outlined",
  },

  glass: {
    styleVariant: "glass",
    radius: "rounded",
    shadow: "medium",
    glassEffect: true,
    blurEffects: true,
    blurIntensity: 30,
    transparencyLevel: 0.1,
    backgroundAnimation: true,
    accentColor: "#8b5cf6",
    cardStyle: "glass",
  },

  spiderman: {
    themeMode: "dark",
    styleVariant: "premium",
    selectedPalette: "spiderman",
    selectedFont: "bebas-neue",
    radius: "small",
    shadow: "strong",
    glassEffect: true,
    blurEffects: true,
    blurIntensity: 20,
    transparencyLevel: 0.08,
    backgroundAnimation: true,
    accentColor: "#E31212",
    cardStyle: "glass",
    motionLevel: "high",
    contrastBoost: true,
  },
};

/* ============================================
   PALETTE SYSTEM
   ============================================ */

export interface PaletteColors {
  bg: string;
  surface: string;
  accent: string;
  text: string;
  muted: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  nativeMode: "light" | "dark";
  light: PaletteColors;
  dark: PaletteColors;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "original",
    name: "Original",
    nativeMode: "light",
    // Placeholder values — Original uses the CSS cascade defaults
    light: { bg: "#FAFAFA", surface: "#EDEDED", accent: "#7C3AED", text: "#0A0A0F", muted: "#56565C" },
    dark:  { bg: "#0A0A0F", surface: "#1A1A22", accent: "#A78BFA", text: "#F5F5F5", muted: "#9898A6" },
  },
  {
    id: "obsidian-gold",
    name: "Obsidian Gold",
    nativeMode: "dark",
    dark:  { bg: "#0A0A0B", surface: "#1A1812", accent: "#C9A96E", text: "#F5F0E8", muted: "#B5A090" },
    light: { bg: "#F5F0E8", surface: "#EDE5D8", accent: "#A07840", text: "#0A0A0B", muted: "#6B5E50" },
  },
  {
    id: "alabaster-noir",
    name: "Alabaster Noir",
    nativeMode: "light",
    light: { bg: "#F7F4EF", surface: "#E8E2D9", accent: "#2C2825", text: "#0F0E0C", muted: "#B5A898" },
    dark:  { bg: "#0F0E0C", surface: "#1E1A17", accent: "#E8D9B8", text: "#F7F4EF", muted: "#7A6E64" },
  },
  {
    id: "midnight-cobalt",
    name: "Midnight Cobalt",
    nativeMode: "dark",
    dark:  { bg: "#07090F", surface: "#0D1526", accent: "#4A7FCC", text: "#E8EEF8", muted: "#5A6A88" },
    light: { bg: "#E8EEF8", surface: "#D0DBF0", accent: "#1A3A6B", text: "#07090F", muted: "#607090" },
  },
  {
    id: "sage-cream",
    name: "Sage & Cream",
    nativeMode: "light",
    light: { bg: "#F9F6F0", surface: "#DFE8DE", accent: "#3D6B47", text: "#1A2E1C", muted: "#8AAB87" },
    dark:  { bg: "#1A2E1C", surface: "#223825", accent: "#8AAB87", text: "#F9F6F0", muted: "#5A7A5D" },
  },
  {
    id: "smoked-mauve",
    name: "Smoked Mauve",
    nativeMode: "dark",
    dark:  { bg: "#120E12", surface: "#2A1F2A", accent: "#C4A0C4", text: "#F2EAF2", muted: "#7A5C7A" },
    light: { bg: "#F2EAF2", surface: "#E0D0E0", accent: "#7A5C7A", text: "#120E12", muted: "#A880A8" },
  },
  {
    id: "spiderman",
    name: "Spider-Man",
    nativeMode: "dark",
    dark:  { bg: "#000000", surface: "#0F0F10", accent: "#E31212", text: "#FFFFFF", muted: "#888888" },
    light: { bg: "#F5F5F5", surface: "#E8E8E8", accent: "#B30F0F", text: "#000000", muted: "#555555" },
  },
];

/* ============================================
   FONT SYSTEM
   ============================================ */

export interface FontOption {
  id: string;
  name: string;
  family: string;
  importParam: string; // Google Fonts URL parameter (empty for original)
  type: string;
  useFor: string;
  /** Multiplier applied to heading clamp sizes (1 = default) */
  headingScale?: number;
  /** Body line-height override */
  lineHeight?: string;
  /** Body letter-spacing override */
  letterSpacing?: string;
  /** Heading letter-spacing override */
  headingLetterSpacing?: string;
  /** Heading line-height override */
  headingLineHeight?: string;
  /** Body font-size scale (1 = default) */
  bodyScale?: number;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "original",
    name: "Original",
    family: "",
    importParam: "",
    type: "Default",
    useFor: "Site Default",
    // All defaults — no overrides needed
    headingScale: 1,
    lineHeight: "1.6",
    letterSpacing: "0em",
    headingLetterSpacing: "-0.02em",
    headingLineHeight: "1.1",
    bodyScale: 1,
  },
  {
    // Playfair Display: editorial serif. Slightly bigger, more breathing room
    id: "playfair-display",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    importParam: "Playfair+Display:ital,wght@0,400;0,700;1,400",
    type: "Display Serif",
    useFor: "Hero / Titles",
    headingScale: 1.08,
    lineHeight: "1.7",
    letterSpacing: "0.005em",
    headingLetterSpacing: "-0.015em",
    headingLineHeight: "1.12",
    bodyScale: 1.02,
  },
  {
    // Josefin Sans: geometric, spaced-out. Needs extra tracking + relaxed line height
    id: "josefin-sans",
    name: "Josefin Sans",
    family: "'Josefin Sans', sans-serif",
    importParam: "Josefin+Sans:wght@100;300;400;600",
    type: "Geometric Sans",
    useFor: "UI / Navigation / Labels",
    headingScale: 1.04,
    lineHeight: "1.65",
    letterSpacing: "0.04em",
    headingLetterSpacing: "0.02em",
    headingLineHeight: "1.1",
    bodyScale: 1,
  },
  {
    // DM Serif Display: classical, dignified. Needs larger heading + comfortable body
    id: "dm-serif-display",
    name: "DM Serif Display",
    family: "'DM Serif Display', serif",
    importParam: "DM+Serif+Display:ital@0;1",
    type: "Classical Serif",
    useFor: "Hero / Section Headings",
    headingScale: 1.1,
    lineHeight: "1.72",
    letterSpacing: "0.008em",
    headingLetterSpacing: "-0.01em",
    headingLineHeight: "1.15",
    bodyScale: 1.03,
  },
  {
    // Raleway: elegant geometric sans. Slightly tighter, airy feeling
    id: "raleway",
    name: "Raleway",
    family: "'Raleway', sans-serif",
    importParam: "Raleway:wght@200;300;400;600",
    type: "Elegant Sans",
    useFor: "Body Copy / General UI",
    headingScale: 1.0,
    lineHeight: "1.68",
    letterSpacing: "0.02em",
    headingLetterSpacing: "0.01em",
    headingLineHeight: "1.08",
    bodyScale: 1,
  },
  {
    // Bebas Neue: all-caps condensed display. Needs BIG heading size, tight leading,
    // wide tracking on body, and body scaled up since it lacks lowercase descenders
    id: "bebas-neue",
    name: "Bebas Neue",
    family: "'Bebas Neue', sans-serif",
    importParam: "Bebas+Neue",
    type: "Cinematic Display",
    useFor: "Hero / Titles / Spiderman",
    headingScale: 1.25,
    lineHeight: "1.4",
    letterSpacing: "0.08em",
    headingLetterSpacing: "0.05em",
    headingLineHeight: "1.0",
    bodyScale: 1.1,
  },
];

export const GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2?family=";
