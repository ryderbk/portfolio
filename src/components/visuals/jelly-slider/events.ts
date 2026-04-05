import {
  MOUSE_MAX_X,
  MOUSE_MIN_X,
  MOUSE_RANGE_MAX,
  MOUSE_RANGE_MIN,
  MOUSE_SMOOTHING,
  TARGET_MAX,
  TARGET_MIN,
  TARGET_OFFSET,
} from './constants.ts';
import { mouseManager } from '@/lib/mouse-manager';

export class EventHandler {
  private canvas: HTMLCanvasElement;
  private mouseX = 1.0;
  private targetMouseX = 1.0;
  private isMouseDown = false;
  private rect: DOMRect | null = null;
  private cleanupFns: (() => void)[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.updateRect();
    this.setupEventListeners();
  }

  private updateRect() {
    this.rect = this.canvas.getBoundingClientRect();
  }

  private setupEventListeners() {
    // Mouse events
    const upHandler = () => { this.isMouseDown = false; };
    const leaveHandler = () => { this.isMouseDown = false; };
    const downHandler = (e: MouseEvent) => { this.handlePointerDown(e.clientX); };

    this.canvas.addEventListener('mouseup', upHandler, { passive: true });
    this.canvas.addEventListener('mouseleave', leaveHandler, { passive: true });
    this.canvas.addEventListener('mousedown', downHandler, { passive: true });

    // Use global mouse manager for movement to avoid redundant window listeners
    const unsubscribe = mouseManager.subscribe((x, _y) => {
      if (!this.isMouseDown) return;
      this.handlePointerMove(x);
    });

    this.cleanupFns.push(() => {
      this.canvas.removeEventListener('mouseup', upHandler);
      this.canvas.removeEventListener('mouseleave', leaveHandler);
      this.canvas.removeEventListener('mousedown', downHandler);
      unsubscribe();
    });

    // Touch events
    const tsHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      this.handlePointerDown(touch.clientX);
    };
    const tmHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (!this.isMouseDown) return;
      const touch = e.touches[0];
      this.handlePointerMove(touch.clientX);
    };
    const teHandler = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      this.isMouseDown = false;
    };

    this.canvas.addEventListener('touchstart', tsHandler, { passive: false });
    this.canvas.addEventListener('touchmove', tmHandler, { passive: false });
    this.canvas.addEventListener('touchend', teHandler, { passive: false });

    this.cleanupFns.push(() => {
      this.canvas.removeEventListener('touchstart', tsHandler);
      this.canvas.removeEventListener('touchmove', tmHandler);
      this.canvas.removeEventListener('touchend', teHandler);
    });

    const resizeHandler = () => this.updateRect();
    window.addEventListener('resize', resizeHandler, { passive: true });
    this.cleanupFns.push(() => window.removeEventListener('resize', resizeHandler));
  }

  onCleanup() {
    this.cleanupFns.forEach(fn => fn());
  }

  private handlePointerDown(clientX: number) {
    this.isMouseDown = true;
    this.updateTargetMouseX(clientX);
  }

  private handlePointerMove(clientX: number) {
    this.updateTargetMouseX(clientX);
  }

  private updateTargetMouseX(clientX: number) {
    if (!this.rect) this.updateRect();
    const rect = this.rect!;
    const normalizedX = (clientX - rect.left) / rect.width;
    const clampedX = Math.max(MOUSE_MIN_X, Math.min(MOUSE_MAX_X, normalizedX));
    this.targetMouseX =
      ((clampedX - MOUSE_RANGE_MIN) / (MOUSE_RANGE_MAX - MOUSE_RANGE_MIN)) *
        (TARGET_MAX - TARGET_MIN) +
      TARGET_OFFSET;
  }

  update() {
    if (this.isMouseDown) {
      this.mouseX += (this.targetMouseX - this.mouseX) * MOUSE_SMOOTHING;
    }
  }

  get currentMouseX() {
    return this.mouseX;
  }

  get isPointerDown() {
    return this.isMouseDown;
  }
}
