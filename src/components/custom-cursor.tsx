import { useEffect, useRef } from "react";
import { mouseManager } from "@/lib/mouse-manager";

/**
 * Custom cursor: a small dot tracking the pointer 1:1 + a trailing ring
 * that lerps toward the target. Ring scales up over interactive elements.
 *
 * - Pointer position drives motion via a single rAF loop (no React re-renders).
 * - Hidden on touch devices and when the user prefers reduced motion.
 * - Hover scaling triggered by the existing `.interactive` class convention.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let raf = 0;
    let visible = false;

    const unsub = mouseManager.subscribe((x, y) => {
      targetX = x;
      targetY = y;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    });

    const tick = () => {
      // Dot follows pointer 1:1 — feels precise and responsive.
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      // Ring eases toward the target — cinematic trail without heavy work.
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover scaling: detect interactive elements under the pointer.
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [role='button'], input, textarea, select, .interactive, .project-accordion-item",
      );
      ring.style.setProperty("--cursor-scale", interactive ? "2.2" : "1");
      ring.classList.toggle("is-hover", !!interactive);
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
