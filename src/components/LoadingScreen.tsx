import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let completed = false;
    let completion = 0;
    const markReady = () => {
      if (completed) return;
      completed = true;
      setReady(true);
      completion = window.setTimeout(onComplete, reduced ? 0 : 550);
    };
    const fallback = window.setTimeout(markReady, reduced ? 600 : 3000);
    window.addEventListener('showroom:ready', markReady, { once: true });
    return () => {
      window.clearTimeout(fallback);
      window.clearTimeout(completion);
      window.removeEventListener('showroom:ready', markReady);
    };
  }, [onComplete]);

  return (
    <div className={`control-loader${ready ? ' is-exiting' : ''}`} role="status" aria-live="polite">
      <div className="control-loader__mark" aria-hidden="true">JUNKBRANDING</div>
      <div className="control-loader__bar" aria-hidden="true"><span /></div>
      <span className="sr-only">{ready ? '読み込みが完了しました' : '読み込み中'}</span>
    </div>
  );
}