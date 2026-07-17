import { MousePointer2 } from 'lucide-react';

interface MouseModeButtonProps {
  preferred: boolean;
  onSelect: () => void;
}

export function MouseModeButton({ preferred, onSelect }: MouseModeButtonProps) {
  return (
    <button
      className="mode-choice"
      type="button"
      data-preferred={preferred || undefined}
      onClick={onSelect}
    >
      <MousePointer2 aria-hidden="true" strokeWidth={1.5} />
      <span className="mode-choice__label">Mouse Mode</span>
      <span className="mode-choice__ja">通常のマウスで操作する</span>
      {preferred && <span className="mode-choice__preferred">前回の選択</span>}
    </button>
  );
}