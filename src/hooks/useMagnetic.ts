import { useEffect, useRef } from "react";

/**
 * Magnetic hover effect: the element subtly follows the cursor when hovered.
 * Uses transform only (compositor) and a single rAF loop per element.
 *
 * @param strength Maximum offset in pixels at the element's edge. Default 8.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(strength = 8) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let active = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (active || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const start = () => {
      active = true;
      el.style.willChange = "transform";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      targetX = Math.max(-1, Math.min(1, relX)) * strength;
      targetY = Math.max(-1, Math.min(1, relY)) * strength;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const end = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
      // Drop the layer hint after the spring-back finishes.
      window.setTimeout(() => {
        if (!active) el.style.willChange = "auto";
      }, 400);
    };

    el.addEventListener("mouseenter", start);
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", end);
    return () => {
      el.removeEventListener("mouseenter", start);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", end);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
