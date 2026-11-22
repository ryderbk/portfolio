import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/smooth-scroll";
import { Magnetic } from "@/components/cinema/Magnetic";

const words = ["experiences", "products", "systems", "machines"];

function useIstClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }));
    f();
    const i = setInterval(f, 15000);
    return () => clearInterval(i);
  }, []);
  return t;
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const cycle = useRef<HTMLSpanElement>(null);
  const time = useIstClock();
  const played = useRef(false);

  // Intro timeline once preloader is leaving
  useEffect(() => {
    if (!ready || played.current) return;
    played.current = true;
    const ctx = gsap.context(() => {
      gsap.set(".c-hero [data-in]", { autoAlpha: 1 });
      if (prefersReducedMotion()) return;
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".c-line-in", { yPercent: 115, rotate: 3, duration: 1.4, stagger: 0.12 }, 0)
        .from(".c-hero [data-in]", { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.5)
        .from(".c-hero-name", { yPercent: 40, autoAlpha: 0, duration: 1.8 }, 0.3);
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Word cycle
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = gsap.utils.toArray<HTMLElement>(".c-cycle-word", cycle.current!);
    gsap.set(els, { yPercent: 140, autoAlpha: 0 });
    gsap.set(els[0], { yPercent: 0, autoAlpha: 1 });
    const tl = gsap.timeline({ repeat: -1, delay: 3 });
    els.forEach((el, i) => {
      const next = els[(i + 1) % els.length];
      tl.to(el, { yPercent: -140, duration: 0.8, ease: "expo.inOut" }, "+=2")
        .fromTo(next, { yPercent: 140, autoAlpha: 1 }, { yPercent: 0, duration: 0.8, ease: "expo.inOut", immediateRender: false }, "<")
        .set(el, { autoAlpha: 0 });
    });
    return () => { tl.kill(); };
  }, []);

  // Scroll choreography + pointer parallax
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".c-hero-content", { yPercent: -14, opacity: 0.1, scale: 0.96, ease: "none", scrollTrigger: scrub });
      gsap.to(".c-hero-name", { xPercent: -22, ease: "none", scrollTrigger: scrub });
      gsap.to(".c-orb.a", { yPercent: 35, ease: "none", scrollTrigger: scrub });
      gsap.to(".c-hero-grid", { yPercent: 18, ease: "none", scrollTrigger: scrub });
    }, root);
    const a = root.current!.querySelector<HTMLElement>(".c-orb.a")!;
    const move = (e: MouseEvent) => {
      const x = (e.clientX / innerWidth - 0.5) * 2, y = (e.clientY / innerHeight - 0.5) * 2;
      gsap.to(a, { x: x * -50, y: y * -40, duration: 1.4, ease: "power3.out" });
    };
    window.addEventListener("mousemove", move);
    return () => { ctx.revert(); window.removeEventListener("mousemove", move); };
  }, []);

  const hide = ready ? undefined : { visibility: "hidden" as const };
  return (
    <section ref={root} id="top" className="c-hero" aria-label="Introduction">
      <div className="c-hero-bg" aria-hidden="true">
        <div className="c-hero-grid" /><div className="c-orb a" /><div className="c-orb b" />
      </div>
      <div className="c-hero-name" aria-hidden="true">BHARATH KUMAR</div>
      <div className="c-wrap c-hero-content" style={{ position: "relative", zIndex: 1 }}>
        <div className="c-hero-meta mono" data-in style={hide}>
          <span className="c-status"><i /> Available for opportunities</span>
          <span>Chennai, IN — {time} IST</span>
        </div>
        <h1 aria-label="I craft experiences, not just code.">
          <span className="c-line" aria-hidden="true">
            <span className="c-line-in">I craft{" "}
              <span ref={cycle} className="c-cycle">
                <em className="c-cycle-sizer">{words.reduce((a, b) => (b.length > a.length ? b : a))},</em>
                {words.map((w) => <em key={w} className="c-cycle-word">{w},</em>)}
              </span>
            </span>
          </span>
          <span className="c-line" aria-hidden="true"><span className="c-line-in">not just code.</span></span>
        </h1>
        <div className="c-hero-foot">
          <p className="c-hero-lede" data-in style={hide}>
            <strong>Bharath Kumar S</strong> — an electronics &amp; instrumentation engineer who writes software. I build interfaces, firmware and the systems between them.
          </p>
          <div className="c-hero-ctas" data-in style={hide}>
            <Magnetic><button className="c-btn solid" onClick={() => scrollToTarget("#work")}>See my work <Arrow /></button></Magnetic>
            <Magnetic><button className="c-btn" onClick={() => scrollToTarget("#contact")}>Let’s talk <Arrow /></button></Magnetic>
          </div>
        </div>
      </div>
      <div className="c-scroll-hint mono" data-in style={hide}><i /> Scroll</div>
    </section>
  );
}

export const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 12 12 2M4 2h8v8" /></svg>
);
