import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

const technicalSkills = [
  { name: "Python" },
  { name: "C / C++" },
  { name: "HTML / CSS" },
  { name: "JavaScript" },
  { name: "React" },
  { name: "Git & GitHub" },
  { name: "AI-Assisted Dev" },
  { name: "MATLAB" },
];

const creativeSkills = [
  { name: "Video Editing" },
  { name: "Graphic Design" },
  { name: "Photoshop" },
  { name: "UI/UX Design" },
];

const hardwareSkills = [
  { name: "Arduino" },
  { name: "Embedded Systems" },
  { name: "Microcontrollers" },
  { name: "Sensor Integration" },
  { name: "Circuit Design" },
  { name: "IoT Systems" },
];

const softSkills = ["Problem Solving", "Communication", "Teamwork", "Adaptability", "Curiosity"];
const languages = ["English", "Tamil"];

export function Skills() {
  const prefersReduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fadeUp = (delay = 0) => (prefersReduced || isMobile)
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay } }
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: 'easeOut', delay } };

  return (
    <section id="skills" className="py-24 md:py-36 border-t border-border" aria-label="Skills and technologies">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
           {...fadeUp()}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em]">03 — Technical Arsenal</span>
          </div>
          <h2 className="skills-headline text-[clamp(2rem,5vw,4rem)] font-display font-semibold tracking-tight leading-tight">
            Tools & technologies I work with.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Technical Skills — Large tile */}
          <motion.div
            {...fadeUp(0.1)}
            className="skills-card glass-card p-6 md:col-span-2 lg:col-span-2"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Technical
            </h3>
            <div className="skill-tags flex flex-wrap gap-3">
              {technicalSkills.map((s, i) => (
                <motion.span
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-4 py-2.5 border border-border rounded-xl text-sm font-medium
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    transition-all duration-200 cursor-default select-none"
                >
                  {s.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Hardware Skills */}
          <motion.div
            {...fadeUp(0.15)}
            className="skills-card glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Hardware
            </h3>
            <div className="skill-tags flex flex-wrap gap-2.5">
              {hardwareSkills.map((s, i) => (
                <motion.span
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-3.5 py-2 border border-border rounded-xl text-sm
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    transition-all duration-200 cursor-default select-none"
                >
                  {s.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Creative Skills */}
          <motion.div
            {...fadeUp(0.2)}
            className="skills-card glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Creative
            </h3>
            <div className="skill-tags flex flex-wrap gap-2.5">
              {creativeSkills.map((s, i) => (
                <motion.span
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-3.5 py-2 border border-border rounded-xl text-sm
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    transition-all duration-200 cursor-default select-none"
                >
                  {s.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            {...fadeUp(0.25)}
            className="skills-card glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Soft Skills
            </h3>
            <div className="skill-tags flex flex-wrap gap-2.5">
              {softSkills.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-3.5 py-2 border border-border rounded-xl text-sm
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    transition-all duration-200 cursor-default select-none"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            {...fadeUp(0.3)}
            className="skills-card glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Languages
            </h3>
            <div className="skill-tags flex flex-wrap gap-2.5">
              {languages.map((lang, i) => (
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="px-3.5 py-2 border border-border rounded-xl text-sm
                    hover:border-accent hover:bg-accent/5 hover:text-accent
                    transition-all duration-200 cursor-default select-none"
                >
                  {lang}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
