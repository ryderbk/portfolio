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
