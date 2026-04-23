import { motion } from "framer-motion";

/**
 * Full-screen overlay wipe that plays once on initial app mount.
 * Slides off using transform (compositor-only) for a cinematic page entrance.
 * Respects prefers-reduced-motion via CSS media query in index.css.
 */
export function PageLoadOverlay() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.45, delay: 0, ease: [0.83, 0, 0.17, 1] }}
      className="page-load-overlay"
      aria-hidden="true"
    />
  );
}
