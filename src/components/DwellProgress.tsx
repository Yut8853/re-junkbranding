import type { RefObject } from 'react';

interface DwellProgressProps {
  progressRef: RefObject<SVGCircleElement | null>;
}

export function DwellProgress({ progressRef }: DwellProgressProps) {
  return (
    <svg className="hand-cursor__progress" viewBox="0 0 38 38" aria-hidden="true">
      <circle ref={progressRef} cx="19" cy="19" r="16" pathLength="100" />
    </svg>
  );
}