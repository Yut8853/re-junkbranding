import { useCallback, useRef } from 'react';

export function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const streamRef = useRef<MediaStream | null>(null);
  const endedHandlerRef = useRef<(() => void) | null>(null);
  const generationRef = useRef(0);

  const stopCamera = useCallback(() => {
    generationRef.current += 1;
    const stream = streamRef.current;
    streamRef.current = null;
    if (stream) {
      for (const track of stream.getTracks()) {
        if (endedHandlerRef.current) track.removeEventListener('ended', endedHandlerRef.current);
        track.stop();
      }
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    endedHandlerRef.current = null;
  }, [videoRef]);

  const startCamera = useCallback(async (onEnded: () => void) => {
    stopCamera();
    const generation = generationRef.current;
    if (!window.isSecureContext) throw new DOMException('Insecure context', 'SecurityError');
    if (!navigator.mediaDevices?.getUserMedia) throw new DOMException('Media devices unavailable', 'NotSupportedError');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: 'user' },
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 24 },
        },
      });
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== 'OverconstrainedError') throw error;
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    }
    if (generation !== generationRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      throw new DOMException('Camera startup cancelled', 'AbortError');
    }
    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((track) => track.stop());
      throw new DOMException('Video element unavailable', 'InvalidStateError');
    }
    streamRef.current = stream;
    endedHandlerRef.current = onEnded;
    stream.getTracks().forEach((track) => track.addEventListener('ended', onEnded, { once: true }));
    video.srcObject = stream;
    let playbackTimeout = 0;
    try {
      await Promise.race([
        video.play(),
        new Promise<never>((_, reject) => {
          playbackTimeout = window.setTimeout(
            () => reject(new DOMException('Camera video did not start', 'NotReadableError')),
            8000,
          );
        }),
      ]);
    } catch (error) {
      stopCamera();
      throw error;
    } finally {
      window.clearTimeout(playbackTimeout);
    }
    return stream;
  }, [stopCamera, videoRef]);

  return { startCamera, stopCamera };
}