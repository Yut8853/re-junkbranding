import {
  CLICK_COOLDOWN,
  DWELL_CLICK_DURATION,
  DWELL_MAX_SPEED,
  DWELL_MOVE_TOLERANCE,
  HAND_TARGET_SELECTOR,
} from './handControlConfig';
import type { CursorFrame } from './handControlTypes';

export interface DwellResult {
  actionable: boolean;
  progress: number;
}

export class DwellController {
  private target: HTMLElement | null = null;
  private startedAt = 0;
  private originX = 0;
  private originY = 0;
  private cooldownUntil = 0;
  private activatedTarget: HTMLElement | null = null;

  update(cursor: CursorFrame, timestamp: number, suspended: boolean): DwellResult {
    if (suspended) return { actionable: this.target !== null, progress: 0 };
    if (!this.target && cursor.speed > DWELL_MAX_SPEED) return { actionable: false, progress: 0 };
    let target = this.findTarget(cursor.x, cursor.y);
    const distanceFromOrigin = Math.hypot(cursor.x - this.originX, cursor.y - this.originY);
    if (this.target?.isConnected && !target && distanceFromOrigin <= DWELL_MOVE_TOLERANCE) {
      target = this.target;
    }
    if (!target) {
      this.resetTarget();
      this.activatedTarget = null;
      return { actionable: false, progress: 0 };
    }
    if (target !== this.activatedTarget) this.activatedTarget = null;
    if (target === this.activatedTarget) return { actionable: true, progress: 0 };
    if (target !== this.target || distanceFromOrigin > DWELL_MOVE_TOLERANCE) {
      this.target = target;
      this.startedAt = timestamp;
      this.originX = cursor.x;
      this.originY = cursor.y;
    }
    if (timestamp < this.cooldownUntil) return { actionable: true, progress: 0 };
    const progress = Math.min((timestamp - this.startedAt) / DWELL_CLICK_DURATION, 1);
    if (progress >= 1) {
      this.cooldownUntil = timestamp + CLICK_COOLDOWN;
      this.activatedTarget = target;
      this.resetTarget();
      target.click();
      return { actionable: true, progress: 0 };
    }
    return { actionable: true, progress };
  }

  reset(): void {
    this.resetTarget();
    this.cooldownUntil = 0;
    this.activatedTarget = null;
  }

  private resetTarget(): void {
    this.target = null;
    this.startedAt = 0;
  }

  private findTarget(x: number, y: number): HTMLElement | null {
    if (
      document.body.dataset.handExhibit === 'true' &&
      !document.querySelector('[aria-modal="true"]')
    ) {
      return document.querySelector<HTMLElement>('[data-hand-exhibit-target]');
    }
    const offsets = [
      [0, 0],
      [24, 0],
      [-24, 0],
      [0, 24],
      [0, -24],
      [17, 17],
      [-17, 17],
      [17, -17],
      [-17, -17],
    ];
    for (const [offsetX, offsetY] of offsets) {
      const hits = document.elementsFromPoint(x + offsetX, y + offsetY);
      for (const hit of hits) {
        const target = hit.closest<HTMLElement>(HAND_TARGET_SELECTOR);
        if (target && this.isAvailable(target)) return target;
      }
    }
    return null;
  }

  private isAvailable(target: HTMLElement): boolean {
    if (target.matches(':disabled, [aria-disabled="true"], [inert]')) return false;
    if (target.closest('[inert], [aria-hidden="true"]')) return false;
    const style = window.getComputedStyle(target);
    if (style.display === 'none' || style.visibility === 'hidden' || style.pointerEvents === 'none') return false;
    return true;
  }
}