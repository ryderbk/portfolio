import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;
let tick: ((time: number) => void) | null = null;

export function initSmoothScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });
  lenis.on("scroll", ScrollTrigger.update);
  tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(500, 33);
  return lenis;
}

export function destroySmoothScroll() {
  if (tick) gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
  tick = null;
}

export const getLenis = () => lenis;

export function lockScroll(locked: boolean) {
  if (lenis) {
    locked ? lenis.stop() : lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function scrollToTarget(target: string | number | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target as any, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof target === "string") document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

/** Pages without smooth scroll (admin, login) call this so a stale scroll lock can never trap the page. */
export function releaseScrollLock() {
  destroySmoothScroll();
  const root = document.documentElement;
  root.style.removeProperty("overflow");
  root.style.removeProperty("overflow-y");
  root.classList.remove("lenis", "lenis-smooth", "lenis-stopped", "lenis-scrolling");
  document.body.style.removeProperty("overflow");
  delete document.body.dataset.menu;
}
