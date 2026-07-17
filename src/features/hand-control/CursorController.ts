import {
  CURSOR_DEAD_ZONE,
  CURSOR_HORIZONTAL_MARGIN,
  CURSOR_MAX_INTERPOLATION,
  CURSOR_MIN_INTERPOLATION,
  CURSOR_VERTICAL_MARGIN,
} from './handControlConfig';
import type { CursorFrame } from './handControlTypes';

function mapFromCamera(value: number, margin: number, size: number): number {
  const usableRange = 1 - margin * 2;
  const mapped = (value - margin) / usableRange;
  return Math.max(0, Math.min(size, mapped * size));
}

export class CursorController {
  private x = 0;
  private y = 0;
  private targetX = 0;
  private targetY = 0;
  private previousX = 0;
  private previousY = 0;
  private previousTime = 0;
  private initialized = false;

  setTarget(normalizedX: number, normalizedY: number): void {
    const nextX = mapFromCamera(1 - normalizedX, CURSOR_HORIZONTAL_MARGIN, window.innerWidth);
    const nextY = mapFromCamera(normalizedY, CURSOR_VERTICAL_MARGIN, window.innerHeight);
    if (this.initialized && Math.hypot(nextX - this.targetX, nextY - this.targetY) < CURSOR_DEAD_ZONE) return;
    this.targetX = nextX;
    this.targetY = nextY;
    if (!this.initialized) this.resetToTarget();
  }

  resetToTarget(): void {
    this.x = this.targetX;
    this.y = this.targetY;
    this.previousX = this.x;
    this.previousY = this.y;
    this.previousTime = performance.now();
    this.initialized = true;
  }

  update(timestamp: number): CursorFrame {
    const targetDistance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
    const response = Math.min(targetDistance / 240, 1);
    const interpolation = CURSOR_MIN_INTERPOLATION +
      (CURSOR_MAX_INTERPOLATION - CURSOR_MIN_INTERPOLATION) * response;
    this.x += (this.targetX - this.x) * interpolation;
    this.y += (this.targetY - this.y) * interpolation;
    const elapsed = Math.max(timestamp - this.previousTime, 1);
    const speed = Math.hypot(this.x - this.previousX, this.y - this.previousY) / elapsed;
    this.previousX = this.x;
    this.previousY = this.y;
    this.previousTime = timestamp;
    return { x: this.x, y: this.y, speed };
  }

  reset(): void {
    this.initialized = false;
    this.previousTime = 0;
  }

  pause(): void {
    this.previousX = this.x;
    this.previousY = this.y;
    this.previousTime = performance.now();
  }
}