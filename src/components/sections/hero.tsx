import { useEffect, useState } from "react";
import { useMotionValue, useSpring, motion, AnimatePresence } from "framer-motion";
import { mouseManager } from "@/lib/mouse-manager";
import { Button } from "@/components/ui/button";

const words = ["experiences,", "products,", "solutions,"];

function WordCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <span 
      className="relative inline-flex items-baseline overflow-hidden"
      style={{ minWidth: "12ch", height: "auto" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block whitespace-nowrap"
          aria-live="polite"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  },
};

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const unsubscribe = mouseManager.subscribe((x, y) => {
      mouseX.set((x / window.innerWidth - 0.5) * 2);
      mouseY.set((y / window.innerHeight - 0.5) * 2);
    });
    return () => unsubscribe();
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Accent glow */}
      <div
        className="absolute top-1/4 right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16 relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div variants={item} className="flex items-center gap-3 mb-10">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground font-medium">
              Available for opportunities
            </span>
          </motion.div>

          {/* Main heading — LCP element */}
          <motion.h1
            variants={item}
            className="font-display font-semibold mb-8"
            style={{
              fontSize: "clamp(calc(2.25rem * var(--font-heading-scale, 1)), calc(7vw * var(--font-heading-scale, 1)), calc(6.5rem * var(--font-heading-scale, 1)))",
              lineHeight: "var(--font-heading-line-height, 1.1)",
              letterSpacing: "var(--font-heading-letter-spacing, -0.02em)",
            }}
          >
            I craft{" "}
            <span className="inline-block align-baseline italic font-light text-accent">
              <WordCycle />
            </span>
            <br />
            not just code.
          </motion.h1>

          {/* Subline */}
          <motion.p
            variants={item}
            className="text-[clamp(1rem,1.5vw,1.25rem)] font-light text-muted-foreground max-w-xl mb-12 leading-relaxed"
          >
            <strong className="font-semibold text-foreground">Bharath Kumar S</strong> – UI/UX Designer who blends creativity and functionality to build smooth, user-friendly digital experiences.
          </motion.p>

          {/* CTAs — Accent primary + Ghost secondary */}
          <motion.div variants={item} className="flex flex-wrap gap-4 items-center">
            <Button
              variant="default"
              onClick={() => scrollTo("#work")}
              data-testid="btn-view-work"
              aria-label="View my projects"
            >
              See My Work
            </Button>

            <Button
              variant="default"
              onClick={() => scrollTo("#contact")}
              data-testid="btn-contact"
              aria-label="Go to contact section"
            >
              Let's Talk
            </Button>
          </motion.div>

          {/* Metrics bar */}
          <motion.div
            variants={item}
            className="flex gap-12 mt-16 pt-8 hero-metrics"
          >
            <div>
              <span className="block text-2xl font-display font-semibold">3+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Projects</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-semibold">7.98</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">CGPA</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-semibold">2+</span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">Domains</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>

        {/* Location — Desktop only */}
        <motion.div
          className="absolute bottom-10 right-6 md:right-12 hidden md:flex flex-col items-end gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="text-xs font-sans text-muted-foreground uppercase tracking-widest font-medium">Chennai, India</span>
          <span className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest">Batch 2023–2027</span>
        </motion.div>
      </div>
    </section>
  );
}
