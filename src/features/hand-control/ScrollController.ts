import {
  CURSOR_VERTICAL_MARGIN,
  MAX_SCROLL_SPEED,
  SCROLL_DEAD_ZONE,
  SCROLL_SENSITIVITY,
} from './handControlConfig';

export class ScrollController {
  private anchorY: number | null = null;

  update(pinching: boolean, handY: number): boolean {
    if (!pinching) {
      this.reset();
      return false;
    }
    if (this.anchorY === null) {
      this.anchorY = handY;
      return true;
    }
    if (handY <= CURSOR_VERTICAL_MARGIN || handY >= 1 - CURSOR_VERTICAL_MARGIN) {
      const direction = handY <= CURSOR_VERTICAL_MARGIN ? 1 : -1;
      window.scrollBy({ top: direction * MAX_SCROLL_SPEED, behavior: 'auto' });
      return true;
    }
    const displacement = this.anchorY - handY;
    if (Math.abs(displacement) < SCROLL_DEAD_ZONE) return true;
    const effectiveDisplacement = displacement - Math.sign(displacement) * SCROLL_DEAD_ZONE;
    const amount = Math.max(
      -MAX_SCROLL_SPEED,
      Math.min(MAX_SCROLL_SPEED, effectiveDisplacement * window.innerHeight * SCROLL_SENSITIVITY),
    );
    window.scrollBy({ top: amount, behavior: 'auto' });
    return true;
  }

  reset(): void {
    this.anchorY = null;
  }
}