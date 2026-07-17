import { useEffect, useRef } from 'react';
import type { ControlMode } from '../hooks/useAppMode';
import { HandModeButton } from './HandModeButton';
import { MouseModeButton } from './MouseModeButton';

interface ModeSelectionProps {
  preferredMode: ControlMode | null;
  handLoading: boolean;
  status: string;
  onHand: () => void;
  onMouse: () => void;
}

export function ModeSelection({ preferredMode, handLoading, status, onHand, onMouse }: ModeSelectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="mode-selector" role="dialog" aria-modal="true" aria-labelledby="mode-title">
      <div className="mode-selector__inner">
        <p className="mode-selector__eyebrow">CONTROL INTERFACE</p>
        <h2 id="mode-title" ref={headingRef} tabIndex={-1}>操作方法を選んでください</h2>
        <div className="mode-selector__choices">
          <HandModeButton preferred={preferredMode === 'hand'} loading={handLoading} onSelect={onHand} />
          <MouseModeButton preferred={preferredMode === 'mouse'} onSelect={onMouse} />
        </div>
        <p className="mode-selector__privacy">
          Hand Modeでは、手の位置を認識するためにカメラを使用します。<br />
          カメラ映像は外部サーバーへ送信せず、ブラウザ内で処理します。
        </p>
        <p className="sr-only" aria-live="polite">{status}</p>
      </div>
    </section>
  );
}