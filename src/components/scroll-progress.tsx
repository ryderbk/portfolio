import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.div
      id="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[60] pointer-events-none origin-left"
      style={{ scaleX, opacity }}
      role="progressbar"
      aria-label="Page scroll progress"
      aria-hidden="true"
    />
  );
}
