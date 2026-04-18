import { useState, useEffect, useRef, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialProjects } from "@/lib/initial-data";

interface ProjectCardProps {
  project: any;
  i: number;
  isActive: boolean;
  currentImgIdx: number;
  onHover: (title: string) => void;
  isMobile: boolean;
}

const ProjectCard = memo(({ project, i, isActive, currentImgIdx, onHover, isMobile }: ProjectCardProps) => {
  const projectImages = project.images || ["/images/project-01.png"];
  const projectTags = project.tags || [];
  const prefersReduced = useReducedMotion();

  const animation = (prefersReduced || isMobile)
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay: i * 0.05 } }
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 } };

  return (
    <motion.article
      layout
      {...animation}
      className={`project-accordion-item group ${isActive ? 'active' : ''}`}
      onMouseEnter={() => !isMobile && onHover(project.title)}
      onClick={() => isMobile && onHover(project.title)}
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
        
        {!isMobile && (
          <div className="project-collapsed-label">
            <h4 className="font-projects">{project.title}</h4>
          </div>
        )}
      </motion.div>

      <div className="project-content-wrapper">
        <div className="project-content-inner">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-sans text-accent uppercase tracking-[0.2em] font-bold">{project.subtitle}</span>
          </div>
          <h3 className="project-title text-2xl md:text-3xl font-projects mb-3 leading-none">
            {project.title}
          </h3>
          <p className="project-description text-sm text-muted-foreground leading-relaxed mb-6 max-w-xl">
            {project.description}
          </p>
          
          <div className="project-tags flex flex-wrap gap-2">
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

      <div className="absolute top-6 right-6 p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/40 backdrop-blur-sm">
        <ArrowUpRight size={18} className="text-white" />
      </div>
    </motion.article>
  );
});

export function Projects() {
  const [activeId, setActiveId] = useState<string>(initialProjects[0].title);
  const [imgCycle, setImgCycle] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const headingAnim = (prefersReduced || isMobile)
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, ease: 'easeOut' } };

  return (
    <section 
      ref={sectionRef}
      id="work" 
      className="py-24 md:py-36 border-t border-border" 
      aria-label="Selected work"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          {...headingAnim}
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

        <div className="projects-accordion min-h-[400px]">
          {initialProjects.map((project, i) => (
            <ProjectCard 
              key={project.title}
              project={project}
              i={i}
              isActive={activeId === project.title}
              currentImgIdx={imgCycle % (project.images?.length || 1)}
              onHover={setActiveId}
              isMobile={isMobile}
            />
          ))}
        </div>

        <motion.div
          {...headingAnim}
          className="mt-12 text-center"
        >
          <Button
            variant="default"
            size="sm"
            className="projects-cta"
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
