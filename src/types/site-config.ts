export type ThemeMode = "dark" | "light" | "system";
export type StyleVariant = "minimal" | "modern" | "glass" | "premium";
export type RadiusSize = "none" | "small" | "normal" | "rounded" | "pill";
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
  modern: {
    styleVariant: "modern",
    radius: "rounded",
    shadow: "soft",
    glassEffect: true,
    blurEffects: true,
    accentColor: "#6366f1",
    cardStyle: "elevated",
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
  "premium-dark": {
    themeMode: "dark",
    styleVariant: "premium",
    radius: "pill",
    shadow: "strong",
    glassEffect: true,
    blurEffects: true,
    accentColor: "#f59e0b",
    backgroundAnimation: true,
    cardStyle: "elevated",
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
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "original",
    name: "Original",
    family: "", // Will be captured at runtime
    importParam: "",
    type: "Default",
    useFor: "Site Default",
  },
  {
    id: "cormorant-garamond",
    name: "Cormorant Garamond",
    family: "'Cormorant Garamond', serif",
    importParam: "Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400",
    type: "High-contrast Serif",
    useFor: "Headings / Display",
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    family: "'Playfair Display', serif",
    importParam: "Playfair+Display:ital,wght@0,400;0,700;1,400",
    type: "Display Serif",
    useFor: "Hero / Titles",
  },
  {
    id: "josefin-sans",
    name: "Josefin Sans",
    family: "'Josefin Sans', sans-serif",
    importParam: "Josefin+Sans:wght@100;300;400;600",
    type: "Geometric Sans",
    useFor: "UI / Navigation / Labels",
  },
  {
    id: "dm-serif-display",
    name: "DM Serif Display",
    family: "'DM Serif Display', serif",
    importParam: "DM+Serif+Display:ital@0;1",
    type: "Classical Serif",
    useFor: "Hero / Section Headings",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "'Raleway', sans-serif",
    importParam: "Raleway:wght@200;300;400;600",
    type: "Elegant Sans",
    useFor: "Body Copy / General UI",
  },
];

export const GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2?family=";
