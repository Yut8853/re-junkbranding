import { useCallback, useEffect, useRef } from 'react';
import { CursorController } from '../features/hand-control/CursorController';
import { DwellController } from '../features/hand-control/DwellController';
import { GestureController } from '../features/hand-control/GestureController';
import { HandTracker } from '../features/hand-control/HandTracker';
import { ScrollController } from '../features/hand-control/ScrollController';
import {
  DETECTION_GRACE_PERIOD,
  HAND_LOST_TIMEOUT,
  MAX_DETECTION_FPS,
} from '../features/hand-control/handControlConfig';
import { useCamera } from './useCamera';

interface HandTrackingRefs {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<SVGCircleElement | null>;
}

interface HandTrackingOptions {
  onFatalError: (error: unknown) => void;
}

export function useHandTracking(refs: HandTrackingRefs, { onFatalError }: HandTrackingOptions) {
  const { videoRef, cursorRef, progressRef } = refs;
  const { startCamera, stopCamera } = useCamera(videoRef);
  const trackerRef = useRef<HandTracker | null>(null);
  const animationFrameRef = useRef(0);
  const generationRef = useRef(0);
  const onFatalErrorRef = useRef(onFatalError);
  onFatalErrorRef.current = onFatalError;

  const stop = useCallback(() => {
    generationRef.current += 1;
    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = 0;
    trackerRef.current?.close();
    trackerRef.current = null;
    stopCamera();
    const cursor = cursorRef.current;
    if (cursor) {
      cursor.hidden = true;
      cursor.dataset.state = 'lost';
      cursor.style.removeProperty('--dwell-progress');
    }
  }, [cursorRef, stopCamera]);

  const start = useCallback(async () => {
    stop();
    const generation = generationRef.current;
    const failIfStale = () => {
      if (generation !== generationRef.current) throw new DOMException('Startup cancelled', 'AbortError');
    };
    const fatal = (error: unknown) => {
      if (generation !== generationRef.current) return;
      stop();
      onFatalErrorRef.current(error);
    };

    await startCamera(() => fatal(new DOMException('Camera stream ended', 'NotReadableError')));
    try {
      failIfStale();
      const tracker = new HandTracker();
      trackerRef.current = tracker;
      await tracker.initialize();
      failIfStale();

      const initialCursor = cursorRef.current;
      if (!initialCursor) throw new Error('Hand cursor is unavailable.');
      initialCursor.hidden = false;
      initialCursor.dataset.state = 'lost';
      initialCursor.style.transform = `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0) translate(-50%, -50%)`;

      const cursorController = new CursorController();
      const dwellController = new DwellController();
      const gestureController = new GestureController();
      const scrollController = new ScrollController();
      let lastDetectionAt = 0;
      let lastVideoTime = -1;
      let lastHandAt = 0;
      let handVisible = false;
      let detectedOnLatestFrame = false;

      const loop = (timestamp: number) => {
        if (generation !== generationRef.current) return;
        const video = videoRef.current;
        const cursorElement = cursorRef.current;
        if (!video || !cursorElement) return fatal(new Error('Hand control elements unavailable.'));
        try {
          const detectionInterval = 1000 / MAX_DETECTION_FPS;
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
              timestamp - lastDetectionAt >= detectionInterval && video.currentTime !== lastVideoTime) {
            lastDetectionAt = timestamp;
            lastVideoTime = video.currentTime;
            const hand = tracker.detect(video, timestamp).landmarks[0];
            if (hand) {
              detectedOnLatestFrame = true;
              const wasLost = !handVisible;
              handVisible = true;
              lastHandAt = timestamp;
              const pointerX = hand[8].x * 0.82 + hand[7].x * 0.18;
              const pointerY = hand[8].y * 0.82 + hand[7].y * 0.18;
              cursorController.setTarget(pointerX, pointerY);
              if (wasLost) cursorController.pause();
              const pinching = gestureController.update(hand[4], hand[8], hand[0], hand[9]);
              scrollController.update(pinching, hand[9].y);
              cursorElement.dataset.pinching = pinching ? 'true' : 'false';
            } else if (timestamp - lastHandAt > DETECTION_GRACE_PERIOD) {
              detectedOnLatestFrame = false;
              cursorElement.dataset.pinching = 'false';
            }
          }

          if (handVisible && timestamp - lastHandAt > HAND_LOST_TIMEOUT) {
            handVisible = false;
            cursorController.pause();
            dwellController.reset();
            gestureController.reset();
            scrollController.reset();
            cursorElement.dataset.state = 'lost';
            cursorElement.hidden = false;
          }

          if (handVisible) {
            const cursor = cursorController.update(timestamp);
            cursorElement.hidden = false;
            cursorElement.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0) translate(-50%, -50%)`;
            window.dispatchEvent(new CustomEvent('showroom:hand-pointer', {
              detail: { x: cursor.x, y: cursor.y, active: detectedOnLatestFrame },
            }));
            const scrolling = detectedOnLatestFrame && cursorElement.dataset.pinching === 'true';
            const dwell = dwellController.update(cursor, timestamp, scrolling || !detectedOnLatestFrame);
            const state = !detectedOnLatestFrame ? 'lost' : scrolling ? 'scrolling' : dwell.progress > 0 ? 'dwelling' : dwell.actionable ? 'actionable' : 'normal';
            cursorElement.dataset.state = state;
            cursorElement.style.setProperty('--dwell-progress', String(dwell.progress));
            if (progressRef.current) progressRef.current.style.strokeDashoffset = String(100 - dwell.progress * 100);
          }
          animationFrameRef.current = window.requestAnimationFrame(loop);
        } catch (error) {
          fatal(error);
        }
      };

      animationFrameRef.current = window.requestAnimationFrame(loop);
    } catch (error) {
      if (generation === generationRef.current) stop();
      throw error;
    }
  }, [cursorRef, progressRef, startCamera, stop, videoRef]);

  useEffect(() => stop, [stop]);
  return { start, stop };
}