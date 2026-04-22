import { useEffect, useRef, useState } from "react";
import "./FloatingRedPlaceholder.css";

export default function FloatingRedPlaceholder() {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const offsetTop = ref.current?.parentElement?.getBoundingClientRect().top ?? 0;
  const relativeScroll = Math.max(0, scrollY - 1500);
  const floatY = relativeScroll * 0.15;
  const morphX = Math.sin(relativeScroll * 0.003) * 30;

  return (
    <div
      ref={ref}
      className="floating-red-placeholder"
      aria-hidden="true"
      style={{
        transform: `translate(${morphX}px, ${floatY}px) rotate(${scrollY * 0.02}deg)`,
      }}
    >
      <div className="frp-inner" />
      <div className="frp-glow" />
    </div>
  );
}
