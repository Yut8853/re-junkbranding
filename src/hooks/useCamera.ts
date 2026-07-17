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
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: { ideal: 640, max: 960 },
        height: { ideal: 480, max: 720 },
        frameRate: { ideal: 24, max: 30 },
      },
    });
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
    try {
      await video.play();
    } catch (error) {
      stopCamera();
      throw error;
    }
    return stream;
  }, [stopCamera, videoRef]);

  return { startCamera, stopCamera };
}