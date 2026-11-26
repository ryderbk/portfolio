import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Trailing ring + dot. Elements opt in with data-cursor="hover" or data-cursor="Label". */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const dot = el.querySelector<HTMLElement>(".c-cursor-dot")!;
    const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
    gsap.set(el, { opacity: 0 });
    let shown = false;

    const move = (e: MouseEvent) => {
      x(e.clientX); y(e.clientY);
      // dot stays near-instant by counter-offsetting the ring's easing
      dx(0); dy(0);
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" });
      }
    };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest?.("[data-cursor], a, button, input, textarea") as HTMLElement | null;
      const kind = t?.getAttribute("data-cursor");
      el.classList.toggle("is-hover", !!t && !kind);
      el.classList.toggle("is-label", !!kind && kind !== "hover");
      if (kind && kind !== "hover" && label.current) label.current.textContent = kind;
      if (kind === "hover") el.classList.add("is-hover");
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="c-cursor" aria-hidden="true">
      <div className="c-cursor-ring"><span ref={label} className="c-cursor-label">View</span></div>
      <div className="c-cursor-dot" />
    </div>
  );
}
