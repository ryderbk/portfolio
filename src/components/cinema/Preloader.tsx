import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function Preloader({ onDone, onExitStart }: { onDone: () => void; onExitStart: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLElement>(null);
  const done = useRef(onDone);
  const start = useRef(onExitStart);
  done.current = onDone;
  start.current = onExitStart;

  useEffect(() => {
    const state = { n: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".c-pre-name span", { yPercent: 110, duration: 0.8, ease: "expo.out" }, 0)
        .to(state, {
          n: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(state.n)).padStart(2, "0");
          },
        }, 0)
        .to(bar.current, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
        .add(() => start.current(), "+=0.1")
        .to(".c-pre-top, .c-pre-bot > *", { yPercent: -40, opacity: 0, duration: 0.5, ease: "power3.in" }, "<")
        .to(root.current, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, "<0.1")
        .add(() => done.current());
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="c-pre" aria-hidden="true">
      <div className="c-pre-top mono">
        <span>Portfolio — 2026</span>
        <span>Chennai, IN</span>
      </div>
      <div className="c-pre-bot">
        <div className="c-pre-name"><span style={{ display: "inline-block" }}>Bharath Kumar S</span></div>
        <div className="c-pre-count"><span ref={count}>00</span></div>
      </div>
      <div className="c-pre-bar"><i ref={bar as any} /></div>
    </div>
  );
}
