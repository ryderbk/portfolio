import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { SectionHeading } from "@/components/section-heading";

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

        {/* Education */}
        <motion.div {...fadeUp(0.1)} className="max-w-xl">
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
      </div>
    </section>
  );
}
