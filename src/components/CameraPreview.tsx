import type { RefObject } from 'react';
import { SHOW_CAMERA_PREVIEW } from '../features/hand-control/handControlConfig';

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function CameraPreview({ videoRef }: CameraPreviewProps) {
  return (
    <div className={`camera-preview${SHOW_CAMERA_PREVIEW ? ' is-visible' : ''}`} aria-hidden="true">
      <video ref={videoRef} muted playsInline />
    </div>
  );
}