import { Hand } from 'lucide-react';

interface HandModeButtonProps {
  preferred: boolean;
  loading: boolean;
  onSelect: () => void;
}

export function HandModeButton({ preferred, loading, onSelect }: HandModeButtonProps) {
  return (
    <button
      className="mode-choice"
      type="button"
      data-preferred={preferred || undefined}
      disabled={loading}
      aria-busy={loading}
      onClick={onSelect}
    >
      <Hand aria-hidden="true" strokeWidth={1.5} />
      <span className="mode-choice__label">Hand Mode</span>
      <span className="mode-choice__ja">{loading ? 'カメラを準備しています…' : '手の動きで操作する'}</span>
      {preferred && <span className="mode-choice__preferred">前回の選択</span>}
    </button>
  );
}