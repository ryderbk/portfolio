import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { SectionHeading } from "@/components/section-heading";

const brings = [
  { title: "AI-Assisted Development", desc: "Leverage modern AI tools to ship real, working products faster — not just prototypes or concepts." },
  { title: "Systems Thinking", desc: "Fluent in both hardware and software. I design solutions at the intersection of disciplines." },
  { title: "Cross-Disciplinary Approach", desc: "Electronics, robotics, web development, design — breadth creates deeper understanding." },
  { title: "Proven Problem-Solving", desc: "Real projects, measurable outcomes. From autonomous robots to full-stack applications." },
];

const principles = [
  { title: "Build With Purpose", desc: "Every line of code should serve a clear goal. I build to solve real problems." },
  { title: "Learn by Doing", desc: "Mastery comes from shipping real projects and iterating fast." },
  { title: "Simplicity Over Complexity", desc: "The best solutions are elegant, maintainable, and easy to extend." },
  { title: "Embrace the Intersection", desc: "The most interesting work happens where hardware meets software, and design meets engineering." },
];

const education = {
  degree: "B.E. Electronics & Instrumentation",
  institution: "Velammal Engineering College, Chennai",
  period: "2023–2027",
  cgpa: "7.98",
  experience: "Interned at Brakes India Private Limited — precision automotive manufacturing and quality engineering.",
};

export function About() {
  return (
    <section id="about" className="py-24 md:py-36" aria-label="About me">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Intro row — heading + bio on the left, portrait on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-24 items-start">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <SectionHeading eyebrow="02 — About" className="mb-8 md:mb-10 max-w-2xl">
              Engineer who thinks in systems, builds with intention.
            </SectionHeading>
            <motion.p {...fadeUp(0.1)} className="text-[clamp(1rem,1.5vw,1.25rem)] font-light text-muted-foreground leading-relaxed max-w-xl">
              I'm a fast-moving engineer who thinks in systems and builds with intention.
              I combine technical depth with creative problem-solving — whether I'm writing code,
              designing a solution, or understanding a manufacturing process.
            </motion.p>
          </div>

          {/* Portrait — right side */}
          <motion.div {...fadeUp(0.15)} className="lg:col-span-4 order-1 lg:order-2 flex justify-center lg:justify-end w-full lg:mt-9">
            <div className="relative w-full max-w-[260px] md:max-w-[300px] group">
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="glass-card relative overflow-hidden rounded-2xl aspect-[4/5] p-0">
                <img
                  src="/images/profile.png"
                  alt="Portrait of Bharath Kumar S"
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Left — education */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-5">
            {/* Education card */}
            <div className="glass-card p-6 space-y-3">
              <h3 className="text-sm font-sans uppercase tracking-widest text-accent font-medium">Education</h3>
              <div>
                <span className="block font-display font-semibold">{education.degree}</span>
                <span className="block text-sm text-muted-foreground mt-1">{education.institution}</span>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs font-sans px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">{education.period}</span>
                  <span className="text-xs font-sans px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">CGPA: {education.cgpa}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
                {education.experience}
              </p>
            </div>
          </motion.div>

          {/* Right — what I bring + principles */}
          <div className="lg:col-span-6 lg:col-start-7">
            {/* What I Bring */}
            <motion.div {...fadeUp(0.15)} className="mb-12">
              <h3 className="text-sm font-sans uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border font-medium">
                What I Bring
              </h3>
              <div className="space-y-0">
                {brings.map((b, i) => (
                  <motion.div
                    key={b.title}
                    {...fadeUp(0.15 + i * 0.08)}
                    className="flex gap-6 py-5 border-b border-border group"
                  >
                    <span className="font-sans text-xs text-accent shrink-0 mt-1 font-medium">0{i + 1}</span>
                    <div>
                      <h4 className="font-medium mb-1 group-hover:text-accent transition-colors duration-200">{b.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Core Principles (merged from Philosophy) */}
            <motion.div {...fadeUp(0.3)}>
              <h3 className="text-sm font-sans uppercase tracking-widest text-muted-foreground mb-6 pb-4 border-b border-border font-medium">
                Core Principles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {principles.map((p, i) => (
                  <motion.div
                    key={p.title}
                    {...fadeUp(0.3 + i * 0.07)}
                    className="p-5 border border-border rounded-xl hover:border-accent/40 transition-colors duration-300 group"
                  >
                    <h4 className="font-medium text-sm mb-2 group-hover:text-accent transition-colors duration-200">
                      {p.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
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
