import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion, splitReveal } from "@/lib/gsap";
import { destroySmoothScroll, initSmoothScroll, lockScroll } from "@/lib/smooth-scroll";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Preloader } from "@/components/cinema/Preloader";
import { Cursor } from "@/components/cinema/Cursor";
import { Nav } from "@/components/cinema/Nav";
import { ScrollProgress } from "@/components/cinema/ScrollProgress";
import { Marquee } from "@/components/cinema/Marquee";
import { Hero } from "@/components/sections/hero";
import { Statement } from "@/components/sections/statement";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { KeyboardSection } from "@/components/sections/keyboard-section";
import { Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  const { config } = useSiteConfig();
  const root = useRef<HTMLDivElement>(null);
  const reduced = prefersReducedMotion();
  const [ready, setReady] = useState(reduced);
  const [loaded, setLoaded] = useState(reduced);
  const smooth = config?.smoothScroll !== false && !reduced;

  // Smooth scroll (Lenis) driven by the GSAP ticker
  useEffect(() => {
    if (!smooth) return;
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, [smooth]);

  // Lock scroll during the preloader; hard fail-safe so content can never stay hidden
  useEffect(() => {
    if (!reduced) lockScroll(true);
    const t = setTimeout(() => { setReady(true); setLoaded(true); lockScroll(false); }, 6000);
    return () => { clearTimeout(t); lockScroll(false); };
  }, [reduced]);

  const onExitStart = useCallback(() => setReady(true), []);
  const onDone = useCallback(() => { setLoaded(true); lockScroll(false); ScrollTrigger.refresh(); }, []);

  // Global reveals: [data-split] headings and [data-reveal] blocks
  useEffect(() => {
    const el = root.current!;
    if (reduced) { el.removeAttribute("data-anim"); return; }
    el.setAttribute("data-anim", "on");
    let splits: any[] = [];
    let batch: ScrollTrigger[] = [];
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      splits = gsap.utils.toArray<HTMLElement>("[data-split]", el).map((h) => splitReveal(h));
      batch = ScrollTrigger.batch(gsap.utils.toArray("[data-reveal]", el), {
        start: "top 90%", once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, overwrite: true }),
      });
      ScrollTrigger.refresh();
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      splits.forEach((s) => s.revert?.());
      batch.forEach((b) => b.kill());
    };
  }, [reduced]);

  return (
    <div ref={root} className="cin dark">
      <div className="c-grain" aria-hidden="true" />
      <a href="#main-content" className="skip-nav">Skip to main content</a>
      {!loaded && <Preloader onExitStart={onExitStart} onDone={onDone} />}
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />
      <main id="main-content">
        <Hero ready={ready} />
        <Marquee />
        <Statement />
        <Projects />
        <About />
        <KeyboardSection />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}
