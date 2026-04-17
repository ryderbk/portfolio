import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { initialProjects } from "@/lib/initial-data";

export function Projects() {
  const [activeId, setActiveId] = useState<string>(initialProjects[0].title);
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
        <div className="projects-accordion min-h-[400px]">
          {initialProjects.map((project, i) => {
            const projectImages = project.images || ["/images/project-01.png"];
            const projectTags = project.tags || [];
            const currentImgIdx = imgCycle % projectImages.length;
            const isActive = activeId === project.title;
            
            return (
              <motion.article
                layout
                key={project.title}
                {...fadeUp(i * 0.1)}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`project-accordion-item group ${isActive ? 'active' : ''}`}
                onMouseEnter={() => {
                  if (activeId !== project.title) setActiveId(project.title);
                }}
              >
                {/* Image Section (Shows full on active, preview on collapsed) */}
                <motion.div layout className="project-image-wrapper">
                  {projectImages.map((img: string, idx: number) => (
                    <img 
                      key={img + idx}
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
                    <h4 className="font-projects">{project.title}</h4>
                  </div>
                </motion.div>

                {/* Expanded Content Section */}
                <div className="project-content-wrapper">
                  <div className="project-content-inner">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-sans text-accent uppercase tracking-[0.2em] font-bold">{project.subtitle}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-projects mb-3 leading-none">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xl">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {projectTags.slice(0, 3).map((tag: string) => (
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
                <div 
                  className="absolute top-6 right-6 p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-sm"
                >
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
          <Button
            variant="default"
            size="sm"
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Go to contact to discuss a project"
          >
            Want to build something like this?
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
