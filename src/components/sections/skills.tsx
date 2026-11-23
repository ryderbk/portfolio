const groups = [
  { n: "01", name: "Languages", items: ["Python", "C++"] },
  { n: "02", name: "Development", items: ["Frontend & Backend", "Web & App Dev"] },
  { n: "03", name: "AI Tools & Platforms", items: ["Git", "GitHub", "VS Code", "Firebase", "Vercel", "OpenAI Codex", "Antigravity"] },
  { n: "04", name: "Design & Creative", items: ["Canva", "Photo & Video Editing"] },
  { n: "05", name: "Hardware", items: ["Arduino", "Flow Meter Testing", "Industrial Automation"] },
];
const soft = ["Problem solving", "Communication", "Teamwork", "Leadership", "Adaptability", "Curiosity", "Creativity", "Visual storytelling", "Attention to detail", "Time management", "Quality & safety mindset", "Continuous learning"];
const langs = ["English", "Tamil"];

export function Skills() {
  return (
    <section id="skills" className="c-section" aria-label="Skills and technologies">
      <div className="c-wrap">
        <span className="mono c-eyebrow" style={{ marginBottom: "2rem" }}>03 — Toolbox</span>
        <h2 className="c-h2" data-split style={{ marginBottom: "clamp(3rem,6vw,5rem)" }}>
          Tools I <em className="acc">reach</em> for.
        </h2>
        <div>
          {groups.map((g) => (
            <div key={g.name} className="c-skill-row" data-reveal>
              <h3 className="c-skill-name"><span className="mono">{g.n}</span>{g.name}</h3>
              <div className="c-pills">{g.items.map((s) => <span key={s} className="c-pill">{s}</span>)}</div>
            </div>
          ))}
        </div>
        <div className="c-soft" data-reveal>
          <div><span className="mono">Strengths</span><ul>{soft.map((s) => <li key={s}>{s}</li>)}</ul></div>
          <div><span className="mono">Languages</span><ul>{langs.map((s) => <li key={s}>{s}</li>)}</ul></div>
        </div>
      </div>
    </section>
  );
}
