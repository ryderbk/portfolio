// Animation utilities and variants for consistent reusable animations

export const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;
export const EASE_DEFAULT = "easeInOut";

export const DURATION_NORMAL = 0.7;
export const DURATION_FAST = 0.5;
export const DURATION_SLOW = 0.8;

export const ANIMATION_DELAY = {
  NONE: 0,
  XS: 0.1,
  SM: 0.2,
  MD: 0.3,
  LG: 0.4,
};

/**
 * Fade up animation with customizable delay
 * Used across hero, about, projects, skills, contact sections
 * @param delay - Animation delay in seconds
 */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: {
    duration: DURATION_NORMAL,
    delay,
    ease: EASE_SMOOTH,
  },
});

/**
 * Container animation with staggered children
 * Used for animating lists of items
 */
export const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Item animation for children of container
 */
export const itemAnimation = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_NORMAL, ease: EASE_SMOOTH },
  },
};

/**
 * Scale animation for hover effects
 */
export const scaleHover = {
  whileHover: { scale: 1.05 },
  transition: { duration: 0.2 },
};

/**
 * Rotation animation
 */
export const rotateAnimation = (duration = 20) => ({
  animate: { rotate: 360 },
  transition: {
    duration,
    repeat: Infinity,
    ease: "linear",
  },
});
