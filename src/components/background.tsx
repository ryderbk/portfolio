// @ts-ignore
import GradientBlinds from "@/components/visuals/GradientBlinds";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Background() {
  const { config } = useSiteConfig();
  const showAnimation = config?.backgroundAnimation !== false;

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
          <GradientBlinds
            gradientColors={[config?.accentColor || '#FF9FFC', '#5227FF']}
            angle={0}
            noise={0.3}
            blindCount={12}
            blindMinWidth={50}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
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
