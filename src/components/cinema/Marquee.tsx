import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const items = [
  "Python",
  "C++",
  "React",
  "Flutter",
  "Embedded Systems",
  "Industrial Automation",
  "Sensor Design",
  "Arduino",
  "TypeScript",
];

const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c.8 6.7 5.3 11.2 12 12-6.7.8-11.2 5.3-12 12-.8-6.7-5.3-11.2-12-12C6.7 11.2 11.2 6.7 12 0z" /></svg>
);

/** Infinite text band: reacts to scroll velocity (speeds up and flips direction). */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
    const quickTimeScale = gsap.quickTo(loop, "timeScale", { duration: 0.25 });
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const dir = self.direction;
        quickTimeScale(dir * (1 + Math.min(Math.abs(v) / 250, 7)));

        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          gsap.to(loop, { timeScale: dir, duration: 1.2, overwrite: "auto" });
        }, 250);
      },
    });
    return () => {
      if (resetTimer) clearTimeout(resetTimer);
      st.kill();
      loop.kill();
    };
  }, []);

  const renderGroup = (isClone = false) => (
    <div className={`c-marquee-group${isClone ? " is-clone" : ""}`} aria-hidden={isClone || undefined}>
      <div className="c-marquee-item">
        {items.map((t, i) => (
          <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "inherit" }}>
            <span className={i % 2 ? "o" : ""}>{t}</span><Star />
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div ref={root} className="c-marquee" aria-hidden="true">
      <div ref={track} className="c-marquee-track">{renderGroup()}{renderGroup(true)}</div>
    </div>
  );
}
