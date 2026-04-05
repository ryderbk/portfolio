import { motion } from "framer-motion";

const brings = [
  { title: "AI-Assisted Development", desc: "Leverage modern AI tools to ship real, working products faster — not just prototypes or concepts." },
  { title: "Systems Thinking", desc: "Fluent in both hardware and software. I design solutions at the intersection of disciplines." },
  { title: "Cross-Disciplinary Approach", desc: "Electronics, robotics, web development, design — breadth creates deeper understanding." },
  { title: "Proven Problem-Solving", desc: "Real projects, measurable outcomes. From autonomous robots to full-stack applications." },
];

const learning = [
  "Advanced Web Development",
  "Machine Learning & AI",
  "Embedded Systems Design",
  "UI/UX Design Principles",
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

export function About() {
  return (
    <section id="about" className="py-24 md:py-36 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div {...fadeUp()} className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">02 — About</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif font-medium tracking-tight leading-tight max-w-2xl">
            Engineer who thinks in systems, builds with intention.
          </h2>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Left — bio */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-5">
            <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed mb-10">
              I'm a fast-moving engineer who thinks in systems and builds with intention.
              I combine technical depth with creative problem-solving — whether I'm writing code,
              designing a solution, or understanding a manufacturing process.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              Currently pursuing B.E. Electronics & Instrumentation at Velammal Engineering College,
              Chennai (2023–2027). CGPA 7.98. Interned at Brakes India Private Limited where I gained
              hands-on exposure to precision automotive manufacturing and quality engineering.
            </p>
          </motion.div>

          {/* Right — what I bring */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div {...fadeUp(0.15)} className="mb-12">
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border">
                What I Bring
              </h3>
              <div className="space-y-0">
                {brings.map((b, i) => (
                  <motion.div
                    key={b.title}
                    {...fadeUp(0.15 + i * 0.08)}
                    className="flex gap-6 py-5 border-b border-border group"
                  >
                    <span className="font-mono text-xs text-muted-foreground shrink-0 mt-1">0{i + 1}</span>
                    <div>
                      <h4 className="font-medium mb-1 group-hover:text-muted-foreground transition-colors">{b.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.3)}>
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border">
                Currently Learning
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {learning.map((item, i) => (
                  <motion.div
                    key={item}
                    {...fadeUp(0.3 + i * 0.07)}
                    className="interactive glass-card p-4 group"
                  >
                    <span className="block text-xs font-mono text-muted-foreground mb-2">0{i + 1}</span>
                    <span className="text-sm font-medium leading-snug group-hover:text-muted-foreground transition-colors">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
