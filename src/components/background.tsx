import { useState, useEffect } from "react";
// @ts-ignore
import LiquidEther from "@/components/visuals/LiquidEther";

export function Background() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      <div 
        className="liquid-canvas"
        style={{ position: "absolute", inset: 0, zIndex: -1, pointerEvents: "auto" }}
      >
        {isMobile ? (
          <div className="liquid-fallback" />
        ) : (
          <LiquidEther
            mouseForce={20}
            cursorSize={100}
            resolution={0.5}
            colors={["#5227FF", "#FF9FFC", "#B497CF"]}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
          />
        )}
      </div>

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
