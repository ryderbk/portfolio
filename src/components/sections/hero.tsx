import { useEffect, useState, useRef } from "react";
import { useMotionValue, useSpring, motion, AnimatePresence } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { mouseManager } from "@/lib/mouse-manager";

const words = ["experiences,", "products,", "solutions,"];

function WordCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-block">
      <AnimateWord key={index} word={words[index]} />
    </span>
  );
}

function AnimateWord({ word }: { word: string }) {
  return (
    <motion.span
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block"
    >
      {word}
    </motion.span>
  );
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  },
};

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const reRenderCount = useRef(0);

  // Performance debugging: Log re-renders during mouse movement
  useEffect(() => {
    reRenderCount.current++;
    if (reRenderCount.current % 10 === 0) {
      console.log(`Hero re-render count: ${reRenderCount.current} (should stay low during mouse move)`);
    }
  });

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const unsubscribe = mouseManager.subscribe((x, y) => {
      // Direct MotionValue updates bypass React's render loop entirely
      mouseX.set((x / window.innerWidth - 0.5) * 2);
      mouseY.set((y / window.innerHeight - 0.5) * 2);
    });
    return () => unsubscribe();
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Subtle grid background */}
      <motion.div className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] will-change-transform"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          x: springX,
          y: springY,
          scale: 1.1,
          translateZ: 0,
        }}
      />

      {/* Floating blobs */}
      <motion.div
        className="absolute pointer-events-none will-change-transform"
        style={{
          top: "20%", right: "10%",
          width: 400, height: 400,
          background: "radial-gradient(circle, hsl(var(--muted)) 0%, transparent 70%)",
          opacity: 0.5,
          x: springX,
          y: springY,
          translateZ: 0,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16 relative z-10 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={item} className="flex items-center gap-4 mb-10">
            <span className="w-8 h-px bg-muted-foreground" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Available for opportunities
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={item}
            className="text-[clamp(3rem,8vw,7rem)] font-serif font-medium leading-[1.05] tracking-tight mb-8"
          >
            I build{" "}
            <span className="italic font-light text-muted-foreground">
              <WordCycle />
            </span>
            <br />
            not just code.
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl font-light text-muted-foreground max-w-xl mb-12 leading-relaxed"
          >
            Bharath Kumar S — Electronics Engineer, Full-Stack Developer, and creative problem solver based in Chennai.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-wrap gap-4 items-center">
            <button
              className="interactive glass-card group relative inline-flex items-center gap-3 px-8 py-4 text-foreground font-medium text-sm overflow-hidden"
              onClick={() => scrollTo("#work")}
              data-testid="btn-view-work"
            >
              <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
                View My Work
              </span>
              <span className="relative z-10 w-4 h-px bg-current transition-all duration-300 group-hover:w-6 group-hover:translate-x-2" />
            </button>

            <button
              className="interactive glass-card group inline-flex items-center gap-3 px-8 py-4 text-foreground font-medium text-sm"
              onClick={() => scrollTo("#contact")}
              data-testid="btn-contact"
            >
              <span>Get In Touch</span>
              <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-6 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator - Bottom Center */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground to-transparent"
          />
        </motion.div>

        {/* Location Info - Bottom Right */}
        <motion.div
          className="absolute bottom-10 right-6 md:right-12 hidden md:flex flex-col items-end gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest font-medium">Chennai, India</span>
          <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest text-[10px]">Current Batch: 2023–2027</span>
        </motion.div>
      </div>
    </section>
  );
}
