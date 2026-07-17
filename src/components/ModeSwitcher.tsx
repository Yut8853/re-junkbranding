import { SlidersHorizontal } from 'lucide-react';
import type { ControlMode } from '../hooks/useAppMode';

interface ModeSwitcherProps {
  mode: ControlMode;
  onOpen: () => void;
}

export function ModeSwitcher({ mode, onOpen }: ModeSwitcherProps) {
  const label = mode === 'hand' ? 'HAND' : 'MOUSE';
  return (
    <button className="mode-switcher" type="button" onClick={onOpen} aria-label={`現在は${label}モード。操作方法を変更する`}>
      <SlidersHorizontal aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}