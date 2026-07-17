import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface CursorFrame {
  x: number;
  y: number;
  speed: number;
}

export interface HandFrame {
  indexTip: NormalizedLandmark;
  thumbTip: NormalizedLandmark;
  timestamp: number;
}

export type CursorVisualState = 'normal' | 'actionable' | 'dwelling' | 'scrolling' | 'lost';