import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

/** Wrapper whose child is gently pulled toward the pointer. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.5)" });
    const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.5)" });
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { x(0); y(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [strength]);
  return <div ref={ref} className={className} style={{ display: "inline-block" }}>{children}</div>;
}
