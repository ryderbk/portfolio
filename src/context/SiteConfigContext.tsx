import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SiteConfig, DEFAULT_SITE_CONFIG, PRESETS } from "@/types/site-config";
import { configService } from "@/services/configService";

interface SiteConfigContextType {
  config: SiteConfig;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetToDefault: () => void;
  applyPreset: (presetName: string) => void;
  isSyncing: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(configService.getLocalConfig());
  const [isSyncing, setIsSyncing] = useState(false);

  // Apply changes to DOM
  const applyConfigToDOM = useCallback((newConfig: SiteConfig) => {
    const root = document.documentElement;
    
    // Theme
    root.classList.remove("light", "dark");
    root.classList.add(newConfig.themeMode === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : newConfig.themeMode
    );

    // CSS Variables for colors and properties
    root.style.setProperty("--accent", hexToHSL(newConfig.accentColor));
    root.style.setProperty("--primary", newConfig.themeMode === "dark" ? "0 0% 96%" : "240 6% 4%");
    
    // Radius
    const radiusMap = {
      none: "0px",
      small: "0.25rem",
      normal: "0.5rem",
      rounded: "1rem",
      pill: "9999px"
    };
    root.style.setProperty("--radius", radiusMap[newConfig.radius]);

    // Scroll
    root.style.setProperty("--scroll-behavior", newConfig.smoothScroll ? "smooth" : "auto");

    // Effects & Visibility
    root.style.setProperty("--hover-effects", newConfig.hoverEffects ? "1" : "0");
    root.style.setProperty("--motion-level", newConfig.motionLevel);
    
    // Glass/Blur
    if (newConfig.glassEffect) {
      root.style.setProperty("--glass-bg", newConfig.themeMode === "dark" 
        ? `rgba(255, 255, 255, ${newConfig.transparencyLevel / 2})`
        : `rgba(255, 255, 255, ${newConfig.transparencyLevel})`
      );
      root.style.setProperty("--glass-border", `rgba(255, 255, 255, ${newConfig.transparencyLevel + 0.05})`);
    } else {
      root.style.setProperty("--glass-bg", newConfig.themeMode === "dark" ? "hsl(240 4% 10%)" : "hsl(0 0% 100%)");
      root.style.setProperty("--glass-border", "hsl(var(--border))");
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

  const updateConfig = async (updates: Partial<SiteConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    applyConfigToDOM(newConfig);
    configService.saveLocalConfig(newConfig);
    
    // Persist to Firestore (debounced or on interaction)
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

// Helper to convert hex to HSL for CSS variables if needed
function hexToHSL(hex: string): string {
  // Simple implementation for Indigo/generic colors
  // For a real app, use a library or a more robust converter
  // Since we only need it for the --accent variable which expects HSL values
  
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
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
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
