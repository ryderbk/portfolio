import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 8;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 400);
        }, 200);
      }
      setCount(current);
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{ background: 'hsl(var(--background))' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading portfolio"
        >
          <div className="font-display text-sm text-muted-foreground mb-8 tracking-[0.15em] uppercase font-medium">
            Bharath Kumar S
          </div>
          <div className="w-48 h-[2px] bg-border relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${count}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="font-sans text-xs text-muted-foreground mt-4 tabular-nums">
            {count}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
