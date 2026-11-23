import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const items = ["Python", "C++", "Web Development", "App Development", "Firebase", "Vercel", "Arduino", "Industrial Automation", "Git & GitHub", "Video Editing", "Canva"];

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
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const v = self.getVelocity();
        const dir = self.direction;
        gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(v) / 250, 7)), duration: 0.25, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false });
      },
    });
    return () => { st.kill(); loop.kill(); };
  }, []);

  const row = (
    <div className="c-marquee-item">
      {items.map((t, i) => (
        <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: "inherit" }}>
          <span className={i % 2 ? "o" : ""}>{t}</span><Star />
        </span>
      ))}
    </div>
  );
  return (
    <div ref={root} className="c-marquee" aria-hidden="true">
      <div ref={track} className="c-marquee-track">{row}{row}</div>
    </div>
  );
}
