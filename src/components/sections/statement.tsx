import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const text = "I build things that sense, think and feel good to use — from Arduinos and flow meters on the factory floor to *interfaces* in the browser.";

function Counter({ to, decimals = 0, suffix }: { to: number; decimals?: number; suffix?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = el.current!;
    if (prefersReducedMotion()) { node.textContent = to.toFixed(decimals); return; }
    const o = { v: 0 };
    const t = gsap.to(o, {
      v: to, duration: 2, ease: "expo.out",
      scrollTrigger: { trigger: node, start: "top 90%", once: true },
      onUpdate: () => { node.textContent = o.v.toFixed(decimals); },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, [to, decimals]);
  return <div className="c-stat-n"><span ref={el}>{(0).toFixed(decimals)}</span>{suffix && <sup>{suffix}</sup>}</div>;
}

export function Statement() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) { gsap.set(root.current!.querySelectorAll(".w"), { opacity: 1 }); return; }
    const ctx = gsap.context(() => {
      gsap.to(".c-statement .w", {
        opacity: 1, stagger: 0.12, ease: "none",
        scrollTrigger: { trigger: ".c-statement p", start: "top 80%", end: "bottom 45%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = text.split(" ").map((w, i) => {
    const em = w.startsWith("*");
    return <span key={i} className={`w ${em ? "serif" : ""}`}>{w.replace(/\*/g, "")}&nbsp;</span>;
  });
  const stats = [
    { to: 7.89, decimals: 2, label: "CGPA — B.E. EIE", suffix: "" },
    { to: 2, decimals: 0, label: "Industry internships", suffix: "" },
    { to: 3, decimals: 0, label: "Projects built", suffix: "+" },
    { to: 2027, decimals: 0, label: "Graduating class", suffix: "" },
  ];
  return (
    <section ref={root} className="c-section c-statement" aria-label="Summary">
      <div className="c-wrap">
        <p>{words}</p>
        <div className="c-stats" data-reveal>
          {stats.map((s) => (
            <div key={s.label} className="c-stat"><Counter to={s.to} decimals={s.decimals} suffix={s.suffix} /><span className="mono">{s.label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}
