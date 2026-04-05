import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const technicalSkills = [
  { name: "Python", level: 75 },
  { name: "HTML / CSS / Web Dev", level: 80 },
  { name: "C / C++", level: 65 },
  { name: "Git & GitHub", level: 70 },
  { name: "AI-Assisted Development", level: 85 },
  { name: "MATLAB", level: 60 },
];

const creativeSkills = [
  { name: "Video Editing", level: 75 },
  { name: "Graphic Design (Canva)", level: 70 },
  { name: "Photoshop Basics", level: 55 },
  { name: "Embedded Systems (Arduino)", level: 70 },
];

const softSkills = ["Problem Solving", "Communication", "Teamwork", "Adaptability", "Curiosity"];

function SkillBar({ name, level, delay = 0 }: { name: string; level: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-px bg-border relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-foreground origin-left"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-36 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">05 — Technical Arsenal</span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif font-medium tracking-tight leading-tight">
            Tools & technologies I master.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Technical skills */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground pb-4 border-b border-border">
              Technical
            </h3>
            <div className="space-y-7">
              {technicalSkills.map((s, i) => (
                <SkillBar key={s.name} {...s} delay={i * 0.06} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 space-y-16">
            {/* Creative skills */}
            <div className="space-y-8">
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground pb-4 border-b border-border">
                Creative
              </h3>
              <div className="space-y-7">
                {creativeSkills.map((s, i) => (
                  <SkillBar key={s.name} {...s} delay={i * 0.06} />
                ))}
              </div>
            </div>

            {/* Soft skills */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground pb-4 border-b border-border">
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="px-4 py-2 border border-border text-sm hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 cursor-default select-none"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground pb-4 border-b border-border">
                Languages
              </h3>
              <div className="flex flex-wrap gap-3">
                {["English", "Tamil"].map((lang, i) => (
                  <motion.span
                    key={lang}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="px-4 py-2 border border-border text-sm hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 cursor-default select-none"
                  >
                    {lang}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
