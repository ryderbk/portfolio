import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: "gpa-analytics",
    number: "01",
    title: "GPA Analytics",
    subtitle: "Web Application — Academic Analytics",
    images: ["/images/gpa-2.png", "/images/gpa-1.png"],
    description: "A production-ready academic analytics platform with real-time performance insights and predictive analytics engine.",
    problem: "Students lacked a unified tool to predict exam performance and understand their academic standing. Manual calculations were time-consuming and error-prone.",
    approach: "Built a full-stack web application leveraging modern development tools for rapid iteration. Engineered algorithms to calculate internal marks from assignments, CIE scores, and practicals.",
    result: "Delivered a production-ready academic analytics platform with real-time performance insights and predictive analytics.",
    tags: ["AI", "Web Development", "Academic Analytics", "Python", "Full-Stack"],
    year: "2024",
  },
  {
    id: "fire-robot",
    number: "02",
    title: "Fire Detection Robot",
    subtitle: "Hardware — Robotics & Safety Systems",
    images: ["/images/fire-robot.png"],
    description: "Fully autonomous robot prototype for fire detection and suppression in hazardous environments.",
    problem: "Manual fire response is slow and dangerous in confined or complex environments. Early detection and response are critical for safety.",
    approach: "Engineered a fully autonomous robot using Arduino microcontroller, flame sensors, DC motors, servo mechanism for directional control, and automated water pump activation.",
    result: "Successfully navigates toward fire sources and autonomously triggers suppression — ready for refinement into production safety systems.",
    tags: ["Arduino", "Robotics", "Embedded Systems", "Sensors", "C++"],
    year: "2024",
  },
  {
    id: "sound-fan",
    number: "03",
    title: "Sound-Activated Control",
    subtitle: "Hardware — Home Automation & IoT",
    images: ["/images/iot-fan.png"],
    description: "Hands-free home automation system using signal processing for clap detection and relay control.",
    problem: "Traditional physical switches require interaction and don't provide smart home integration. Accessibility is limited for users with mobility constraints.",
    approach: "Designed a microcontroller-based home automation system using sound recognition (clap detection) via microphone, signal processing, and relay circuit control.",
    result: "Created a practical hands-free control system improving accessibility and convenience. Extensible to other smart home applications.",
    tags: ["Microcontroller", "Home Automation", "IoT", "Relay Circuit", "Hardware"],
    year: "2024",
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

export function Projects() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [imgCycle, setImgCycle] = useState(0);

  // Cycle images every 4 seconds for the active project
  useEffect(() => {
    const interval = setInterval(() => {
      setImgCycle(prev => (prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="work" className="py-24 md:py-36 border-t border-border" aria-label="Selected work">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section header */}
        <motion.div
          {...fadeUp()}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em]">01 — Selected Work</span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-display font-semibold tracking-tight leading-tight">
              Case Studies.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            A showcase of engineering solutions across software, robotics, and hardware.
          </p>
        </motion.div>

        {/* Project accordion — Interactive expanding list */}
        <div className="projects-accordion">
          {projects.map((project, i) => {
            const currentImgIdx = imgCycle % project.images.length;
            
            return (
              <motion.article
                key={project.id}
                {...fadeUp(i * 0.1)}
                className={`project-accordion-item group ${activeId === project.id ? 'active' : ''}`}
                onMouseEnter={() => setActiveId(project.id)}
              >
                {/* Image Section (Shows full on active, preview on collapsed) */}
                <div className="project-image-wrapper bg-muted">
                  {project.images.map((img, idx) => (
                    <img 
                      key={img}
                      src={img} 
                      alt={`${project.title} - Preview ${idx + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        idx === currentImgIdx ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  ))}
                  
                  {/* Collapsed view overlay */}
                  <div className="project-collapsed-label">
                    <h4 className="font-display font-bold">{project.title}</h4>
                  </div>
                </div>

                {/* Expanded Content Section */}
                <div className="project-content-wrapper">
                  <div className="project-content-inner">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-sans text-accent uppercase tracking-widest font-bold">{project.subtitle}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-[9px] font-sans px-2 py-1 border border-border/50 text-muted-foreground uppercase tracking-widest rounded-md bg-background/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* External Link Indicator */}
                <div className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Micro-CTA */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-12 text-center"
        >
          <button
            className="btn-ghost text-sm"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Go to contact to discuss a project"
          >
            <span>Want to build something like this?</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
