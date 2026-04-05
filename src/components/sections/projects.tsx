import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "gpa-analytics",
    number: "01",
    title: "Student Academic & GPA Analytics",
    subtitle: "Web Application — Academic Analytics",
    problem: "Students lacked a unified tool to predict exam performance and understand their academic standing. Manual calculations were time-consuming and error-prone.",
    approach: "Built a full-stack web application leveraging modern development tools for rapid iteration. Engineered algorithms to calculate internal marks from assignments, CIE scores, and practicals. Integrated credit-based GPA/CGPA calculation formulas with a prediction engine analyzing historical performance trends.",
    result: "Delivered a production-ready academic analytics platform with real-time performance insights and predictive analytics. Proven that focused engineering and modern frameworks can solve complex real-world problems efficiently.",
    tags: ["AI", "Web Development", "Academic Analytics", "Python", "Full-Stack"],
    featured: true,
    year: "2024",
    gradient: "from-muted/50 to-muted/20 dark:from-muted/20 dark:to-muted/5",
  },
  {
    id: "fire-robot",
    number: "02",
    title: "Autonomous Fire Detection Robot",
    subtitle: "Hardware — Robotics & Safety Systems",
    problem: "Manual fire response is slow and dangerous in confined or complex environments. Early detection and response are critical for safety.",
    approach: "Engineered a fully autonomous robot using Arduino microcontroller, flame sensors, DC motors, servo mechanism for directional control, and automated water pump activation. Designed custom firmware for autonomous navigation and fire detection logic.",
    result: "Built a working proof-of-concept demonstrating autonomous systems and embedded engineering. Successfully navigates toward fire sources and autonomously triggers suppression — ready for refinement into production safety systems.",
    tags: ["Arduino", "Robotics", "Embedded Systems", "Sensors", "C++"],
    featured: false,
    year: "2024",
    gradient: "from-muted/50 to-muted/20 dark:from-muted/20 dark:to-muted/5",
  },
  {
    id: "sound-fan",
    number: "03",
    title: "Sound-Activated Fan Control",
    subtitle: "Hardware — Home Automation & IoT",
    problem: "Traditional physical switches require interaction and don't provide smart home integration. Accessibility is limited for users with mobility constraints.",
    approach: "Designed a microcontroller-based home automation system using sound recognition (clap detection) via microphone, signal processing, and relay circuit control. Implemented filtering to prevent accidental activations.",
    result: "Created a practical hands-free control system improving accessibility and convenience. Demonstrates IoT fundamentals and is extensible to other smart home applications.",
    tags: ["Microcontroller", "Home Automation", "IoT", "Relay Circuit", "Hardware"],
    featured: false,
    year: "2024",
    gradient: "from-muted/50 to-muted/20 dark:from-muted/20 dark:to-muted/5",
  },
];

export function Projects() {

  return (
    <section id="work" className="py-24 md:py-36 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">01 — Selected Work</span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-serif font-medium tracking-tight leading-tight">
              Case Studies.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Each project is documented as a case study — problem, approach, and measurable outcome.
          </p>
        </motion.div>

        {/* Interactive Case Studies Accordion */}
        <div className="w-full flex flex-col md:flex-row gap-2 h-auto md:h-[650px] overflow-hidden">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="interactive glass-card group relative flex-1 hover:flex-[6] overflow-hidden min-h-[120px] md:min-h-full"
            >
              {/* Pattern Background overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-background/40 to-transparent pointer-events-none" />

              {/* Title - Rotated and centered when collapsed, Top-Left when expanded */}
              <h3 className="absolute z-20 whitespace-nowrap 
                top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-rotate-90 
                group-hover:top-8 group-hover:left-8 md:group-hover:top-10 md:group-hover:left-10 group-hover:-translate-x-0 group-hover:-translate-y-0 group-hover:rotate-0 
                transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] 
                font-serif font-medium text-xl md:text-3xl tracking-tight text-muted-foreground group-hover:text-foreground">
                {project.title}
              </h3>

              {/* Expanded Hover Details */}
              <div className="absolute z-10 top-[80px] md:top-[100px] left-8 right-8 md:left-10 md:right-10 bottom-6 md:bottom-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-150 flex flex-col overflow-y-auto pr-4 pointer-events-none group-hover:pointer-events-auto">
                
                <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground border-b border-border/50 pb-4 mb-6">
                  {project.subtitle} • {project.year}
                </span>
                
                <div className="space-y-6 md:space-y-8 flex-1">
                  <div>
                    <h4 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 md:mb-3">Problem</h4>
                    <p className="text-sm leading-relaxed text-foreground/80">{project.problem}</p>
                  </div>
                  
                  <div className="h-px bg-border/50 w-full" />
                  
                  <div>
                    <h4 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 md:mb-3">Approach</h4>
                    <p className="text-sm leading-relaxed text-foreground/80">{project.approach}</p>
                  </div>
                  
                  <div className="h-px bg-border/50 w-full" />
                  
                  <div>
                    <h4 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 md:mb-3">Result</h4>
                    <p className="text-sm leading-relaxed text-foreground/80">{project.result}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-8 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] lg:text-xs font-mono px-2 py-1 md:px-3 border border-border/50 text-muted-foreground uppercase tracking-widest bg-background/50">
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
