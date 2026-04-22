// @ts-ignore
import LiquidEther from "@/components/visuals/LiquidEther";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { COLOR_PALETTES } from "@/types/site-config";

export function Background() {
  const { config } = useSiteConfig();
  const showAnimation = config?.backgroundAnimation !== false;

<<<<<<< HEAD
  const { selectedPalette } = config || { selectedPalette: 'original' };
  const palette = COLOR_PALETTES.find(p => p.id === selectedPalette) || COLOR_PALETTES[0];
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDark ? palette.dark : palette.light;

=======
>>>>>>> parent of acf1217 (fix: resolve admin config not applying to DOM and styles)
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        backgroundColor: "hsl(var(--background))",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Background Animation Layer */}
      {showAnimation && (
        <div 
          className="liquid-canvas"
          style={{ position: "absolute", inset: 0, zIndex: -1, pointerEvents: "auto" }}
        >
          <LiquidEther
            mouseForce={20}
            cursorSize={100}
            resolution={0.5}
<<<<<<< HEAD
            colors={[colors.accent, colors.surface, colors.bg]}
=======
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
>>>>>>> parent of acf1217 (fix: resolve admin config not applying to DOM and styles)
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
          />
        </div>
      )}

      {/* Visibility Overlay Scrim */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-colors duration-300"
        style={{
          background: "var(--background-scrim)"
        }}
      />
    </div>
  );
}
