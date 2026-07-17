import { useEffect, useRef } from 'react';
import { CircleAlert, X } from 'lucide-react';

interface ErrorDialogProps {
  message: string;
  onClose: () => void;
  onUseMouse: () => void;
}

export function ErrorDialog({ message, onClose, onUseMouse }: ErrorDialogProps) {
  const mouseRef = useRef<HTMLButtonElement>(null);
  useEffect(() => mouseRef.current?.focus(), []);
  return (
    <div className="control-error-backdrop" role="presentation">
      <section className="control-error" role="alertdialog" aria-modal="true" aria-labelledby="control-error-title" aria-describedby="control-error-message">
        <CircleAlert aria-hidden="true" />
        <h2 id="control-error-title">Hand Modeを開始できません</h2>
        <p id="control-error-message">{message}</p>
        <button className="control-error__mouse" ref={mouseRef} type="button" onClick={onUseMouse}>Mouse Modeを使う</button>
        <button className="control-error__close" type="button" onClick={onClose} aria-label="エラーを閉じる"><X aria-hidden="true" /></button>
      </section>
    </div>
  );
}