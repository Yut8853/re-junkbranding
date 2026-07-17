import type { RefObject } from 'react';
import { DwellProgress } from './DwellProgress';

interface HandCursorProps {
  cursorRef: RefObject<HTMLDivElement | null>;
  progressRef: RefObject<SVGCircleElement | null>;
}

export function HandCursor({ cursorRef, progressRef }: HandCursorProps) {
  return (
    <div ref={cursorRef} className="hand-cursor" data-state="lost" hidden aria-hidden="true">
      <span className="hand-cursor__core" />
      <DwellProgress progressRef={progressRef} />
    </div>
  );
}