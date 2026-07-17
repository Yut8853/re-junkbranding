import { Hand, MousePointerClick, MoveVertical } from 'lucide-react';

export function HandModeGuide() {
  return (
    <aside className="hand-guide" aria-live="polite">
      <p className="hand-guide__title">HAND CONTROL</p>
      <div><Hand aria-hidden="true" /><span>人差し指でポインターを動かす</span></div>
      <div><MousePointerClick aria-hidden="true" /><span>赤い範囲をリンク上で2秒キープ</span></div>
      <div className="hand-guide__scroll"><MoveVertical aria-hidden="true" /><span><strong>SCROLL</strong> 親指と人差し指をつまんだまま上下</span></div>
    </aside>
  );
}