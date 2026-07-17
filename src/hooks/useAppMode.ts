import { useCallback, useEffect, useState } from 'react';

export type ControlMode = 'hand' | 'mouse';
export type AppMode = 'loading' | 'mode-selection' | ControlMode;

const PREFERENCE_KEY = 'preferred-control-mode';

export function useAppMode() {
  const [appMode, setAppMode] = useState<AppMode>('loading');
  const [preferredMode, setPreferredMode] = useState<ControlMode | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(PREFERENCE_KEY);
    if (stored === 'hand' || stored === 'mouse') setPreferredMode(stored);
  }, []);

  const completeLoading = useCallback(() => setAppMode('mode-selection'), []);
  const reopenSelector = useCallback(() => setAppMode('mode-selection'), []);
  const selectMode = useCallback((mode: ControlMode) => {
    window.localStorage.setItem(PREFERENCE_KEY, mode);
    setPreferredMode(mode);
    setAppMode(mode);
  }, []);

  return { appMode, preferredMode, completeLoading, reopenSelector, selectMode };
}