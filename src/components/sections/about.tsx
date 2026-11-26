import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const experience = [
  {
    company: "Toshniwal Hyvac Pvt. Ltd.",
    role: "JULY 2026",
    desc: "Developed an Arduino testing setup for flow meters and gained hands-on industrial automation experience.",
  },
  {
    company: "Breaks India Private Limited",
    role: "DEC 2024",
    desc: "Explored automotive manufacturing, braking systems engineering, and precision quality standards.",
  },
  {
    company: "INSTRAUX'26",
    role: "2026",
    desc: "Led the editing team, created promotional reels and posters, and developed the official event website.",
  },
];

const education = [
  { degree: "B.E. Electronics & Instrumentation", institution: "Velammal Engineering College, Chennai", period: "2023 — 2027", score: "CGPA 7.89" },
  { degree: "Higher Secondary (HSC)", institution: "Kaligi Ranganathan Montford Matric Hr. Sec. School", period: "2021 — 2023", score: "78.33%" },
  { degree: "Secondary (SSLC)", institution: "SKNS PMC Vivekananda Vidyalaya Junior College", period: "2009 — 2021", score: "70.17%" },
];

function Timeline({ items }: { items: { title: string; sub: string; meta?: string; desc?: string; score?: string }[] }) {
  return (
    <div className="c-timeline" data-timeline>
      <div className="c-timeline-rail"><i /></div>
      {items.map((it) => (
        <div key={it.title} className="c-tl-item" data-reveal>
          <div className="c-tl-row"><h4>{it.title}</h4>{it.score ? <span className="c-score">{it.score}</span> : null}</div>
          <p className="c-tl-sub mono" style={{ maxWidth: "none" }}>{it.sub}</p>
          {it.desc && <p>{it.desc}</p>}
        </div>
      ))}
    </div>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".c-portrait", { clipPath: "inset(100% 0 0 0 round 24px)" }, {
        clipPath: "inset(0% 0 0 0 round 24px)", duration: 1.6, ease: "expo.out",
        scrollTrigger: { trigger: ".c-portrait", start: "top 85%", once: true },
      });
      gsap.fromTo(".c-portrait img", { yPercent: -4, scale: 1.05 }, {
        yPercent: 4, scale: 1, ease: "none",
        scrollTrigger: { trigger: ".c-portrait", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((tl) => {
        gsap.to(tl.querySelector(".c-timeline-rail i"), {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 60%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="c-section" aria-label="About me">
      <div className="c-wrap">
        <span className="mono c-eyebrow" style={{ marginBottom: "2rem" }}>02 — About</span>
        <div className="c-about-grid">
          <div className="c-portrait-wrap">
            <div className="c-portrait-glow" />
            <div className="c-portrait">
              <img
                src="/images/profile.webp"
                alt="Portrait of Bharath Kumar S"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <span className="c-portrait-tag mono">Bharath Kumar S — Chennai</span>
            </div>
          </div>
          <div>
            <h2 className="c-h2" data-split style={{ fontSize: "clamp(2.6rem,6vw,6rem)", marginBottom: "2.5rem" }}>
              Engineer who thinks in <em className="acc">systems</em>, builds with intention.
            </h2>
            <p className="c-bio" data-reveal>
              A fast-learning, creative engineer eager to apply skills in <strong>coding, design and problem-solving</strong> to build real products. I pair technical depth with a proactive, adaptable mindset — happiest where hardware meets software.
            </p>

            <div className="c-sub mono"><span className="acc">◆</span> Experience</div>
            <Timeline items={experience.map((e) => ({ title: e.company, sub: e.role, desc: e.desc }))} />

            <div className="c-sub mono"><span className="acc">◆</span> Education</div>
            <Timeline items={education.map((e) => ({ title: e.degree, sub: `${e.institution} · ${e.period}`, score: e.score }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
