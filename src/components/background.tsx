// @ts-ignore
import Antigravity from "@/components/visuals/Antigravity";
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
          <Antigravity
            count={300}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.5}
            lerpSpeed={0.05}
            color={'#FF9FFC'}
            autoAnimate={true}
            particleVariance={1}
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
