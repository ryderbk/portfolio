import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useData } from "@/context/DataContext";
import { getLenis, lockScroll } from "@/lib/smooth-scroll";
import { Card3D } from "@/components/cinema/Card3D";
import { Arrow } from "./hero";

const imgOf = (p: any): string => p.image || p.images?.[0] || "/images/project-01.png";

function CaseStudy({ project, onClose }: { project: any; onClose: () => void }) {
  useEffect(() => {
    lockScroll(true);
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); lockScroll(false); getLenis()?.start(); };
  }, [onClose]);
  return (
    <motion.div className="c-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <motion.div className="c-modal-card c-modal-card-expanded" data-lenis-prevent initial={{ y: 60, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()}>
        <button className="c-close" onClick={onClose} aria-label="Close">✕</button>
        <img
          className="c-modal-img"
          src={imgOf(project)}
          alt={project.title}
          decoding="async"
        />
        <div className="c-modal-expanded-header">
          <h3 className="c-modal-title">{project.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const { projects } = useData();
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<any>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 1024px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".c-work-track")!;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: ".c-work-pin", pin: true, scrub: 0.6, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.utils.toArray<HTMLElement>(".c-panel-media").forEach((m) => {
          gsap.fromTo(m.querySelector("img"), { xPercent: -7 }, {
            xPercent: 7, ease: "none",
            scrollTrigger: { trigger: m, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
        gsap.from(".c-intro-panel > *", { y: 50, autoAlpha: 0, stagger: 0.1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".c-work-pin", start: "top 70%", once: true } });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".c-panel").forEach((p) => {
          gsap.from(p, { y: 70, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 88%", once: true } });
          gsap.fromTo(p.querySelector("img"), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: p, scrub: true } });
        });
      });
    }, root);
    return () => { mm.revert(); ctx.revert(); };
  }, [projects.length]);

  // layout shifts when images land
  useEffect(() => {
    const imgs = root.current?.querySelectorAll("img") ?? [];
    const r = () => ScrollTrigger.refresh();
    imgs.forEach((i) => !i.complete && i.addEventListener("load", r, { once: true }));
  }, [projects.length]);

  return (
    <section ref={root} id="work" className="c-work" aria-label="Selected work">
      <div className="c-work-pin">
        <div className="c-work-track">
          <div className="c-intro-panel">
            <span className="mono c-eyebrow">01 — Selected work</span>
            <h2 className="c-h2" style={{ fontSize: "clamp(3rem,6vw,6.5rem)" }}>Things I’ve <em className="acc">built</em></h2>
            <p className="c-panel-desc">Hardware, software and everything wired between. Scroll to move through the projects →</p>
          </div>
          {projects.map((p, i) => (
            <article key={p.id || p.title} className="c-panel">
              <Card3D depth={14} className="w-full">
                <div className="c-panel-media" data-cursor="Expand" onClick={() => setOpen(p)}>
                  <img
                    src={imgOf(p)}
                    alt={`${p.title} preview`}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={i === 0 ? "high" : "auto"}
                  />
                  <span className="c-panel-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {p.year && <span className="c-panel-year mono">{p.year}</span>}
                </div>
              </Card3D>
              <div className="c-panel-body">
                <div className="c-panel-left">
                  <span className="mono acc">{p.subtitle}</span>
                  <h3 className="c-panel-title">{p.title}</h3>
                  <div className="c-tags">
                    {(p.tags || []).slice(0, 5).map((t: string) => (
                      <span key={t} className="c-tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="c-panel-right">
                  <p className="c-panel-desc">{p.description}</p>
                  <div className="c-panel-actions">
                    <button className="c-btn solid" onClick={() => setOpen(p)}>Expand <Arrow /></button>
                    {p.link && <a className="c-btn" href={p.link} target="_blank" rel="noopener noreferrer">Visit <Arrow /></a>}
                  </div>
                </div>
              </div>
            </article>
          ))}
          <div className="c-end-panel mono">Next up ↓</div>
        </div>
      </div>
      <AnimatePresence>{open && <CaseStudy project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
