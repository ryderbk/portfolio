import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { SectionHeading } from "@/components/section-heading";

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
  return (
    <section id="skills" className="py-24 md:py-36" aria-label="Skills and technologies">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <SectionHeading eyebrow="03 — Technical Arsenal" className="mb-16 md:mb-24">
          Tools &amp; technologies I work with.
        </SectionHeading>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Technical Skills — Large tile */}
          <motion.div
            {...fadeUp(0.1)}
            className="glass-card p-6 md:col-span-2 lg:col-span-2"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Technical
            </h3>
            <div className="flex flex-wrap gap-3">
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
            className="glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Hardware
            </h3>
            <div className="flex flex-wrap gap-2.5">
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
            className="glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Creative
            </h3>
            <div className="flex flex-wrap gap-2.5">
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
            className="glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2.5">
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
            className="glass-card p-6"
          >
            <h3 className="text-sm font-sans uppercase tracking-widest text-accent mb-6 font-medium">
              Languages
            </h3>
            <div className="flex flex-wrap gap-2.5">
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
