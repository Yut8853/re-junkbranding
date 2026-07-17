import type { HandLandmarker as HandLandmarkerInstance, HandLandmarkerResult } from '@mediapipe/tasks-vision';
import { HAND_LANDMARKER_MODEL_PATH, MEDIAPIPE_WASM_PATH } from './handControlConfig';

export async function preloadHandControlAssets(): Promise<void> {
  await Promise.all([
    import('@mediapipe/tasks-vision'),
    fetch(HAND_LANDMARKER_MODEL_PATH, { cache: 'force-cache' }).then((response) => {
      if (!response.ok) throw new Error(`Hand model preload failed: ${response.status}`);
      return response.arrayBuffer();
    }),
    fetch(`${MEDIAPIPE_WASM_PATH}/vision_wasm_internal.wasm`, { cache: 'force-cache' }).then((response) => {
      if (!response.ok) throw new Error(`MediaPipe WASM preload failed: ${response.status}`);
      return response.arrayBuffer();
    }),
  ]);
}

export class HandTracker {
  private landmarker: HandLandmarkerInstance | null = null;

  async initialize(): Promise<void> {
    const [{ FilesetResolver, HandLandmarker }, modelResponse] = await Promise.all([
      import('@mediapipe/tasks-vision'),
      fetch(HAND_LANDMARKER_MODEL_PATH, { cache: 'force-cache' }),
    ]);
    if (!modelResponse.ok) {
      throw new Error(`Hand model request failed: ${modelResponse.status}`);
    }
    const modelAssetBuffer = new Uint8Array(await modelResponse.arrayBuffer());
    if (modelAssetBuffer.byteLength === 0) throw new Error('Hand model is empty.');
    const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_PATH);
    const create = (delegate: 'GPU' | 'CPU') => HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetBuffer, delegate },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.42,
      minHandPresenceConfidence: 0.42,
      minTrackingConfidence: 0.45,
    });
    try {
      this.landmarker = await create('GPU');
    } catch {
      this.landmarker = await create('CPU');
    }
  }

  detect(video: HTMLVideoElement, timestamp: number): HandLandmarkerResult {
    if (!this.landmarker) throw new Error('Hand Landmarker is not initialized.');
    return this.landmarker.detectForVideo(video, timestamp);
  }

  close(): void {
    this.landmarker?.close();
    this.landmarker = null;
  }
}