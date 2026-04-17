import { useEffect, useRef, useState } from "react";
import { mouseManager } from "@/lib/mouse-manager";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const isDesktop = useRef(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const dotSpring = { stiffness: 3000, damping: 80, mass: 0.1 };
  const ringSpring = { stiffness: 1800, damping: 60, mass: 0.2 };

  const dotX = useSpring(cursorX, dotSpring);
  const dotY = useSpring(cursorY, dotSpring);
  const ringX = useSpring(cursorX, ringSpring);
  const ringY = useSpring(cursorY, ringSpring);

  const [isHoveringState, setIsHoveringState] = useState(false);
  const lastHoverMode = useRef(false);

  useEffect(() => {
    isDesktop.current = !window.matchMedia("(pointer: coarse)").matches;
    if (!isDesktop.current) return;

    const unsubscribe = mouseManager.subscribe((x, y) => {
      cursorX.set(x);
      cursorY.set(y);
    });

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t) return;

      const interactive = !!(
        t.tagName === "A" ||
        t.tagName === "BUTTON" ||
        t.classList.contains("interactive") ||
        t.getAttribute("role") === "button" ||
        t.closest("a") ||
        t.closest("button")
      );

      if (interactive !== lastHoverMode.current) {
        lastHoverMode.current = interactive;
        setIsHoveringState(interactive);
      }
    };

    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener("mouseover", over);
    };
  }, [cursorX, cursorY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div aria-hidden="true">
      <motion.div
        className="fixed rounded-full bg-foreground pointer-events-none z-[9999] will-change-transform"
        animate={{ scale: isHoveringState ? 0 : 1 }}
        style={{
          width: 6,
          height: 6,
          x: dotX,
          y: dotY,
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          translateZ: 0,
        }}
      />
      <motion.div
        className="fixed rounded-full border border-foreground pointer-events-none z-[9998] will-change-transform"
        animate={{
          scale: isHoveringState ? 1.5 : 1,
          opacity: isHoveringState ? 0.5 : 1
        }}
        style={{
          width: 32,
          height: 32,
          x: ringX,
          y: ringY,
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          translateZ: 0,
        }}
      />
    </div>
  );
}
