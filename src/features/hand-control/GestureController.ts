import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import {
  PINCH_ENTER_RATIO,
  PINCH_ENTER_THRESHOLD,
  PINCH_EXIT_RATIO,
  PINCH_EXIT_THRESHOLD,
} from './handControlConfig';

export class GestureController {
  private pinching = false;

  update(
    thumbTip: NormalizedLandmark,
    indexTip: NormalizedLandmark,
    wrist: NormalizedLandmark,
    middleFingerMcp: NormalizedLandmark,
  ): boolean {
    const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    const palmSize = Math.hypot(wrist.x - middleFingerMcp.x, wrist.y - middleFingerMcp.y);
    const enterThreshold = Math.max(PINCH_ENTER_THRESHOLD, palmSize * PINCH_ENTER_RATIO);
    const exitThreshold = Math.max(PINCH_EXIT_THRESHOLD, palmSize * PINCH_EXIT_RATIO);
    if (!this.pinching && distance <= enterThreshold) this.pinching = true;
    if (this.pinching && distance >= exitThreshold) this.pinching = false;
    return this.pinching;
  }

  reset(): void {
    this.pinching = false;
  }
}