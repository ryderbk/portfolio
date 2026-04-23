import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { SectionHeading } from "@/components/section-heading";
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Linkedin } from "lucide-react";

const experience = {
  role: "Internship",
  company: "Brakes India Private Limited",
  period: "Dec 2024",
  desc: "Observation-based internship at a leading manufacturer of automotive braking systems. Gained insights into braking technologies, manufacturing processes, and quality practices — building an understanding of industrial workflows and the role of precision engineering in vehicle safety.",
};

const education = [
  {
    degree: "B.E. Electronics & Instrumentation",
    institution: "Velammal Engineering College, Chennai",
    period: "2023 — 2027",
    score: "CGPA: 7.98",
  },
  {
    degree: "Higher Secondary (HSC)",
    institution: "Kaligi Ranganathan Montford Matric Hr. Sec. School",
    period: "2021 — 2023",
    score: "78.33%",
  },
  {
    degree: "Secondary (SSLC)",
    institution: "SKNS PMC Vivekananda Vidyalaya Junior College",
    period: "2009 — 2021",
    score: "70.17%",
  },
];

const languages = ["English", "Tamil"];

const contact = [
  { icon: MapPin, label: "Perambur, Chennai" },
  { icon: Phone, label: "+91 98843 26984", href: "tel:+919884326984" },
  { icon: Mail, label: "sbharathkumar1125@gmail.com", href: "mailto:sbharathkumar1125@gmail.com" },
  { icon: Linkedin, label: "linkedin.com/in/bharathkumarss", href: "https://www.linkedin.com/in/bharathkumarss" },
];

export function About() {
  return (
    <section id="about" className="py-24 md:py-36" aria-label="About me">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Intro row — heading + bio on the left, portrait on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 md:mb-28 items-start">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <SectionHeading eyebrow="02 — About" className="mb-8 md:mb-10 max-w-2xl">
              Engineer who thinks in systems, builds with intention.
            </SectionHeading>
            <motion.p {...fadeUp(0.1)} className="text-[clamp(1rem,1.5vw,1.25rem)] font-light text-muted-foreground leading-relaxed max-w-xl">
              A fast-learning, creative engineer eager to apply skills in coding, design, and problem-solving
              to build real products. I combine technical depth with a proactive, adaptable mindset — thriving
              in dynamic environments where hardware meets software.
            </motion.p>

            {/* Contact chips */}
            <motion.ul {...fadeUp(0.2)} className="mt-8 flex flex-wrap gap-x-5 gap-y-3">
              {contact.map(({ icon: Icon, label, href }) => {
                const content = (
                  <>
                    <Icon className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                         className="group inline-flex items-center gap-2">
                        {content}
                      </a>
                    ) : (
                      <span className="group inline-flex items-center gap-2">{content}</span>
                    )}
                  </li>
                );
              })}
            </motion.ul>
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

        {/* Experience + Education + Languages */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Experience */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Briefcase className="w-4 h-4 text-accent" aria-hidden="true" />
              <h3 className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground font-medium">Experience</h3>
            </div>
            <div className="glass-card p-6 md:p-7 h-full">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h4 className="font-display font-semibold text-lg leading-tight">{experience.company}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{experience.role}</p>
                </div>
                <span className="shrink-0 text-xs font-sans px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">
                  {experience.period}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pt-3 border-t border-border/50">
                {experience.desc}
              </p>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div {...fadeUp(0.18)} className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <GraduationCap className="w-4 h-4 text-accent" aria-hidden="true" />
              <h3 className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground font-medium">Education</h3>
            </div>
            <div className="glass-card p-6 md:p-7 divide-y divide-border/60">
              {education.map((ed, i) => (
                <div key={ed.degree} className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-6 ${i === 0 ? "pb-5" : i === education.length - 1 ? "pt-5" : "py-5"}`}>
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold leading-tight">{ed.degree}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{ed.institution}</p>
                  </div>
                  <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-1 shrink-0">
                    <span className="text-xs font-sans px-3 py-1 bg-accent/10 text-accent rounded-full font-medium">{ed.period}</span>
                    <span className="text-xs font-sans text-muted-foreground sm:text-right">{ed.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="mt-6 flex items-center gap-4">
              <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground font-medium">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {languages.map((l) => (
                  <span key={l} className="text-xs font-sans px-3 py-1 border border-border rounded-full text-muted-foreground">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
