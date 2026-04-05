/**
 * Low-level Mouse Manager
 * Single global listener for all mouse/pointer movements.
 * Bypasses React state to eliminate re-renders and input lag.
 */

type MouseObserver = (x: number, y: number) => void;

class MouseManager {
  private static instance: MouseManager;
  public x = 0;
  public y = 0;
  private observers: Set<MouseObserver> = new Set();
  private ticking = false;

  private constructor() {
    if (typeof window === 'undefined') return;

    const handleMove = (e: PointerEvent | MouseEvent) => {
      this.x = e.clientX;
      this.y = e.clientY;

      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.notifyObservers();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('pointermove', handleMove as any, { passive: true });
    window.addEventListener('mousemove', handleMove as any, { passive: true });
  }

  public static getInstance(): MouseManager {
    if (!MouseManager.instance) {
      MouseManager.instance = new MouseManager();
    }
    return MouseManager.instance;
  }

  public subscribe(observer: MouseObserver) {
    this.observers.add(observer);
    return () => { this.observers.delete(observer); };
  }

  private notifyObservers() {
    this.observers.forEach((observer) => observer(this.x, this.y));
  }
}

export const mouseManager = MouseManager.getInstance();
