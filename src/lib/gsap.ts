import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

/** Mask-reveal a heading line by line when it enters the viewport. */
export function splitReveal(el: HTMLElement, opts: { stagger?: number; start?: string } = {}) {
  return SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "c-split-line",
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 115,
        duration: 1.15,
        ease: "expo.out",
        stagger: opts.stagger ?? 0.09,
        scrollTrigger: { trigger: el, start: opts.start ?? "top 88%", once: true },
      });
    },
  });
}
