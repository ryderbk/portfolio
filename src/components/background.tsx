// @ts-ignore
import LiquidEther from "@/components/visuals/LiquidEther";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function Background() {
  const { config } = useSiteConfig();
  const showAnimation = config?.backgroundAnimation !== false;

  // Get accent color from CSS variables or use defaults
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();

  // Convert HSL to Hex for LiquidEther (fallback to palette colors if not available)
  const liquidColors = ["hsl(var(--accent))", "hsl(var(--primary))", "hsl(var(--secondary))"];

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
            colors={["#7C3AED", "#8B5CF6", "#A78BFA"]}
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
