import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, lockScroll, scrollToTarget } from "@/lib/smooth-scroll";
import { Magnetic } from "./Magnetic";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const links = [
  { id: "work", label: "Work", n: "01" },
  { id: "about", label: "About", n: "02" },
  { id: "skills", label: "Skills", n: "03" },
  { id: "contact", label: "Contact", n: "04" },
];

export function Nav({ ready }: { ready: boolean }) {
  const nav = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useSiteConfig();
  const isDark = resolvedTheme === "dark";

  useEffect(() => { gsap.set(nav.current, { yPercent: -120 }); }, []);
  useEffect(() => {
    if (ready) gsap.to(nav.current, { yPercent: 0, duration: 1.1, ease: "expo.out", delay: 0.2 });
  }, [ready]);

  // active section + hide on scroll down / show on scroll up
  useEffect(() => {
    const triggers = links.map((l) =>
      ScrollTrigger.create({
        trigger: `#${l.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(l.id),
      })
    );
    const hide = ScrollTrigger.create({
      start: 120,
      end: "max",
      onUpdate: (self) => {
        if (!ready || document.body.dataset.menu === "open") return;
        gsap.to(nav.current, { yPercent: self.direction === 1 ? -120 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
      },
    });
    const top = ScrollTrigger.create({ start: 0, end: 120, onToggle: (s) => !s.isActive || setActive("") });
    return () => { triggers.forEach((t) => t.kill()); hide.kill(); top.kill(); };
  }, [ready]);

  const go = (id: string) => {
    if (open) closeMenu(() => scrollToTarget(`#${id}`));
    else scrollToTarget(`#${id}`);
  };

  function openMenu() {
    setOpen(true);
    document.body.dataset.menu = "open";
    lockScroll(true);
    gsap.set(menu.current, { visibility: "visible" });
    gsap.fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
    gsap.from(".c-menu .big, .c-menu-foot", { yPercent: 40, opacity: 0, stagger: 0.07, duration: 0.9, ease: "expo.out", delay: 0.3 });
  }
  function closeMenu(after?: () => void) {
    setOpen(false);
    delete document.body.dataset.menu;
    gsap.to(menu.current, {
      clipPath: "inset(100% 0 0 0)", duration: 0.7, ease: "expo.inOut",
      onComplete: () => { gsap.set(menu.current, { visibility: "hidden" }); lockScroll(false); getLenis()?.start(); after?.(); },
    });
  }

  return (
    <>
      <nav ref={nav} className="c-nav" aria-label="Primary">
        <a href="#top" className="c-logo" onClick={(e) => { e.preventDefault(); scrollToTarget(0); }} data-cursor="hover">
          <b /> BK<span style={{ color: "var(--faint)", fontWeight: 400 }}>.dev</span>
        </a>
        <div className="c-nav-links">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? "is-active" : ""} onClick={(e) => { e.preventDefault(); go(l.id); }}>
              <span>{l.n}</span>{l.label}
            </a>
          ))}
        </div>
        <div className="c-nav-right">
          <Magnetic strength={0.25}>
            <a href="#contact" className="c-nav-cta" onClick={(e) => { e.preventDefault(); go("contact"); }}>Let’s talk ↗</a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <button
              type="button"
              className="c-theme"
              data-cursor="hover"
              aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              title={isDark ? "Light mode" : "Dark mode"}
              onClick={toggleTheme}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
          </Magnetic>
          <button className={`c-burger ${open ? "open" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => (open ? closeMenu() : openMenu())}>
            <span><i /><i /></span>
          </button>
        </div>
      </nav>
      <div ref={menu} className="c-menu" aria-hidden={!open}>
        <div>
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="big" onClick={(e) => { e.preventDefault(); go(l.id); }}><span>{l.n}</span>{l.label}</a>
          ))}
        </div>
        <div className="c-menu-foot mono">sbharathkumarrr@gmail.com<br />Chennai, India</div>
      </div>
    </>
  );
}
