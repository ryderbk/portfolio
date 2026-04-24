import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { initialProjects } from "@/lib/initial-data";
import { subscribeToProjects } from "@/services/firestore";

interface ProjectCardProps {
  project: any;
  i: number;
  isActive: boolean;
  currentImgIdx: number;
  onHover: (title: string) => void;
}

const ProjectCard = memo(({ project, i, isActive, currentImgIdx, onHover }: ProjectCardProps) => {
  const projectImages = project.image 
    ? [project.image]
    : project.images && project.images.length > 0 
      ? project.images 
      : ["/images/project-01.png"];
  const projectTags = project.tags || [];

  return (
    <motion.article
      layout
      {...fadeUp(i * 0.1)}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`project-accordion-item group ${isActive ? 'active' : ''}`}
      onMouseEnter={() => onHover(project.title)}
    >
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
        
        <div className="project-collapsed-label">
          <h4 className="font-projects">{project.title}</h4>
        </div>
      </motion.div>

      <div className="project-content-wrapper">
        <div className="project-content-inner">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-sans text-accent uppercase tracking-[0.2em] font-bold">{project.subtitle}</span>
          </div>
          <h3
            className="font-projects mb-3 leading-none"
            style={{ fontSize: "clamp(1.5rem, calc(2.5vw * var(--font-heading-scale, 1)), calc(2rem * var(--font-heading-scale, 1)))" }}
          >
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xl line-clamp-2 xl:line-clamp-3">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {projectTags.map((tag: string) => (
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

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-6 right-6 group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-[0.15em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 pointer-events-auto border border-primary-foreground/20 hover:border-primary-foreground/40"
        >
          Visit
          <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 opacity-80" />
        </a>
      )}
    </motion.article>
  );
});

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [imgCycle, setImgCycle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch projects from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProjects((data) => {
      // Use Firestore data if available, otherwise fallback to initialProjects
      const finalProjects = data.length > 0 ? data : initialProjects;
      setProjects(finalProjects);
      
      // Set first project as active if none selected
      if (finalProjects.length > 0 && !activeId) {
        setActiveId(finalProjects[0].title);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeId]);

  // Pause interval when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setImgCycle(prev => (prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      id="work" 
      className="py-24 md:py-36" 
      aria-label="Selected work"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          {...fadeUp()}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em]">01 — Selected Work</span>
            </div>
            <h2
              className="font-display font-semibold"
              style={{
                fontSize: "clamp(calc(2rem * var(--font-heading-scale, 1)), calc(5vw * var(--font-heading-scale, 1)), calc(4rem * var(--font-heading-scale, 1)))",
                lineHeight: "var(--font-heading-line-height, 1.1)",
                letterSpacing: "var(--font-heading-letter-spacing, -0.02em)",
              }}
            >
              Case Studies.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            A showcase of engineering solutions across software, robotics, and hardware.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground animate-pulse">Loading amazing projects...</p>
          </div>
        ) : (
          <div className="projects-accordion min-h-[400px]">
            {projects.map((project, i) => (
              <ProjectCard 
                key={project.id || project.title}
                project={project}
                i={i}
                isActive={activeId === project.title}
                currentImgIdx={imgCycle % (project.images?.length || 1)}
                onHover={setActiveId}
              />
            ))}
          </div>
        )}

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
