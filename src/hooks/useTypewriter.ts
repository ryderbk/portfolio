import { useState, useEffect, useRef, useCallback } from "react";

interface UseTypewriterOptions {
  speed?: number;      // ms per character (default 12)
  enabled?: boolean;   // false = show full text immediately (default true)
  onDone?: () => void;
}

interface UseTypewriterReturn {
  displayed: string;
  isTyping: boolean;
  skip: () => void;
}

/**
 * Typewriter hook — reveals `text` character by character.
 * - Caps total duration at 4 000 ms by scaling speed for long texts.
 * - Respects prefers-reduced-motion: shows full text instantly.
 * - Guards against React StrictMode double-run via a mount-ref.
 * - Cleans up on unmount; never leaves a dangling timer.
 */
export function useTypewriter(
  text: string,
  { speed = 12, enabled = true, onDone }: UseTypewriterOptions = {}
): UseTypewriterReturn {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // If disabled or reduced-motion → return full text immediately
  const shouldAnimate = enabled && !prefersReduced;

  const [displayed, setDisplayed] = useState(shouldAnimate ? "" : text);
  const [isTyping, setIsTyping] = useState(shouldAnimate);

  // Refs so callbacks always see fresh values without re-subscribing
  const textRef = useRef(text);
  const onDoneRef = useRef(onDone);
  const skipRef = useRef(false);           // signal to RAF loop to jump to end
  const rafIdRef = useRef<number | null>(null);
  const didRunRef = useRef(false);         // StrictMode guard

  textRef.current = text;
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    skipRef.current = true;
  }, []);

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayed(text);
      setIsTyping(false);
      return;
    }

    // StrictMode guard: skip the second mount
    if (didRunRef.current) return;
    didRunRef.current = true;

    skipRef.current = false;

    const MAX_DURATION = 4000; // ms
    const effectiveSpeed = Math.max(1, Math.min(speed, MAX_DURATION / Math.max(text.length, 1)));

    let charIndex = 0;
    let lastTime: number | null = null;
    let accumulated = 0;

    function tick(now: number) {
      if (skipRef.current) {
        // Skip requested — jump to full text
        setDisplayed(textRef.current);
        setIsTyping(false);
        onDoneRef.current?.();
        return;
      }

      if (lastTime !== null) {
        accumulated += now - lastTime;
      }
      lastTime = now;

      // Advance as many characters as the elapsed time allows
      while (accumulated >= effectiveSpeed && charIndex < textRef.current.length) {
        charIndex++;
        accumulated -= effectiveSpeed;
      }

      setDisplayed(textRef.current.slice(0, charIndex));

      if (charIndex < textRef.current.length) {
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        setIsTyping(false);
        onDoneRef.current?.();
      }
    }

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
    // We intentionally only run this once per mount (text is baked in at mount time).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { displayed, isTyping, skip: finish };
}
