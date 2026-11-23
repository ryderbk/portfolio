import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const experience = [
  {
    company: "Toshniwal Hyvac Pvt. Ltd.",
    role: "Internship · July 2026",
    desc: "Gained practical experience in manufacturing and testing flow meters. Worked on developing a testing setup using Arduino and contributed to an industrial automation project, building knowledge of industrial processes, equipment testing and automation systems.",
  },
  {
    company: "Breaks India Private Limited",
    role: "Internship · Dec 2024",
    desc: "Gained insights into automotive braking technologies, manufacturing processes and quality control practices. Developed an understanding of industrial workflows and precision engineering, and learned the importance of quality and safety in vehicle manufacturing.",
  },
];

const activities = [
  { title: "INSTRUX’26", sub: "Editing Team Lead", desc: "Led the editing team; created promotional reels, designed posters and developed the event website." },
  { title: "RIDDHI’26", sub: "Videography & Video Editing", desc: "Handled videography and video editing for the farewell event." },
  { title: "HIRA Project", sub: "Editing Team", desc: "Contributed to the editing team, producing college promotional videos." },
];

const education = [
  { degree: "B.E. Electronics & Instrumentation Engineering", institution: "Velammal Engineering College, Chennai", period: "2023 — 2027", score: "CGPA 7.89" },
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
      gsap.fromTo(".c-portrait img", { yPercent: -8, scale: 1.25 }, {
        yPercent: 8, scale: 1, ease: "none",
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
              <img src="/images/profile.webp" alt="Portrait of Bharath Kumar S" width="831" height="1108" loading="lazy" decoding="async" />
              <span className="c-portrait-tag mono">Bharath Kumar S — Chennai</span>
            </div>
          </div>
          <div>
            <h2 className="c-h2" data-split style={{ fontSize: "clamp(2.6rem,6vw,6rem)", marginBottom: "2.5rem" }}>
              Engineer by training, <em className="acc">builder</em> by instinct.
            </h2>
            <p className="c-bio" data-reveal>
              A fast-learning, creative and curious Electronics and Instrumentation Engineering student with a strong interest in <strong>Python, C++, problem-solving and software development</strong>. I love exploring emerging technologies, and I’m eager to build efficient, scalable applications, apply my technical skills and keep learning while contributing to innovative projects. Beyond code, I lead teams, tell stories through video and design, and care deeply about quality, safety and getting the details right.
            </p>

            <div className="c-sub mono"><span className="acc">◆</span> Experience</div>
            <Timeline items={experience.map((e) => ({ title: e.company, sub: e.role, desc: e.desc }))} />

            <div className="c-sub mono"><span className="acc">◆</span> Extra-Curricular Activities</div>
            <Timeline items={activities.map((e) => ({ title: e.title, sub: e.sub, desc: e.desc }))} />

            <div className="c-sub mono"><span className="acc">◆</span> Education</div>
            <Timeline items={education.map((e) => ({ title: e.degree, sub: `${e.institution} · ${e.period}`, score: e.score }))} />
          </div>
        </div>
      </div>
    </section>
  );
}
