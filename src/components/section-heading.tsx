import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable section heading with a cinematic reveal:
 *  1. Eyebrow fades up first.
 *  2. The h2 text fades up.
 *  3. A thin underline scales from left to right (scaleX 0 → 1).
 *
 * The underline uses transform-origin: left so it stays compositor-only.
 */
export function SectionHeading({ eyebrow, children, className }: SectionHeadingProps) {
  return (
    <motion.div
      className={`section-heading ${className ?? ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {eyebrow && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="flex items-center gap-4 mb-4"
        >
          <span className="font-sans text-xs text-muted-foreground uppercase tracking-[0.2em]">
            {eyebrow}
          </span>
        </motion.div>
      )}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        }}
        className="font-display font-semibold section-heading-title"
        style={{
          fontSize:
            "clamp(calc(2rem * var(--font-heading-scale, 1)), calc(5vw * var(--font-heading-scale, 1)), calc(4rem * var(--font-heading-scale, 1)))",
          lineHeight: "var(--font-heading-line-height, 1.1)",
          letterSpacing: "var(--font-heading-letter-spacing, -0.02em)",
        }}
      >
        {children}
      </motion.h2>
      <motion.div
        aria-hidden="true"
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 } },
        }}
        className="section-heading-underline"
      />
    </motion.div>
  );
}
