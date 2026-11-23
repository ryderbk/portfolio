import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function ScrollProgress() {
  const bar = useRef<HTMLElement>(null);
  useEffect(() => {
    const t = gsap.to(bar.current, {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
    });
    return () => { t.scrollTrigger?.kill(); t.kill(); };
  }, []);
  return <div className="c-progress" aria-hidden="true"><i ref={bar as any} /></div>;
}
