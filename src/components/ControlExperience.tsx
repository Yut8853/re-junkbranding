import { useCallback, useEffect, useRef, useState } from 'react';
import type { ControlMode } from '../hooks/useAppMode';
import { useAppMode } from '../hooks/useAppMode';
import { useHandTracking } from '../hooks/useHandTracking';
import { CameraPreview } from './CameraPreview';
import { ErrorDialog } from './ErrorDialog';
import { HandCursor } from './HandCursor';
import { HandModeGuide } from './HandModeGuide';
import { ModeSelection } from './ModeSelection';
import { ModeSwitcher } from './ModeSwitcher';
import './controlExperience.css';

function handErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'カメラへのアクセスが許可されませんでした。ブラウザのカメラ設定を確認するか、Mouse Modeをご利用ください。';
  }
  if (error instanceof DOMException && error.name === 'SecurityError') {
    return 'Hand ModeはHTTPSまたはlocalhostでのみ利用できます。Mouse Modeをご利用ください。';
  }
  if (error instanceof DOMException && ['NotFoundError', 'NotReadableError'].includes(error.name)) {
    return 'カメラを利用できませんでした。ブラウザのカメラ設定を確認するか、Mouse Modeをご利用ください。';
  }
  if (error instanceof DOMException && error.name === 'NotSupportedError') {
    return 'このブラウザはカメラ操作に対応していません。Mouse Modeをご利用ください。';
  }
  if (error instanceof Error && /model|wasm|mediapipe|landmarker/i.test(error.message)) {
    return '手の認識モデルを読み込めませんでした。ページを再読み込みして、もう一度Hand Modeを選択してください。';
  }
  return '手の認識機能を読み込めませんでした。通信環境を確認するか、Mouse Modeをご利用ください。';
}

export default function ControlExperience() {
  const { appMode, preferredMode, reopenSelector, selectMode } = useAppMode();
  const [activeMode, setActiveMode] = useState<ControlMode | null>(null);
  const [handLoading, setHandLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  const recoverFromFatalError = useCallback((error: unknown) => {
    setHandLoading(false);
    setActiveMode('mouse');
    selectMode('mouse');
    setErrorMessage(handErrorMessage(error));
  }, [selectMode]);

  const handTracking = useHandTracking(
    { videoRef, cursorRef, progressRef },
    { onFatalError: recoverFromFatalError },
  );

  const chooseHand = async () => {
    if (activeMode === 'hand') {
      selectMode('hand');
      return;
    }
    setErrorMessage('');
    setHandLoading(true);
    setStatus('カメラと手の認識機能を準備しています。');
    try {
      await handTracking.start();
      setActiveMode('hand');
      selectMode('hand');
      setStatus('Hand Modeを開始しました。');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setErrorMessage(handErrorMessage(error));
      setStatus('Hand Modeを開始できませんでした。');
    } finally {
      setHandLoading(false);
    }
  };

  const chooseMouse = () => {
    handTracking.stop();
    setHandLoading(false);
    setActiveMode('mouse');
    selectMode('mouse');
    setStatus('Mouse Modeを開始しました。');
  };

  useEffect(() => {
    if (activeMode !== 'hand') return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') chooseMouse();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeMode, chooseMouse]);

  return (
    <>
      {appMode === 'mode-selection' && (
        <ModeSelection
          preferredMode={preferredMode}
          handLoading={handLoading}
          status={status}
          onHand={chooseHand}
          onMouse={chooseMouse}
        />
      )}
      {activeMode && <ModeSwitcher mode={activeMode} onOpen={reopenSelector} />}
      <HandCursor cursorRef={cursorRef} progressRef={progressRef} />
      {activeMode === 'hand' && <HandModeGuide />}
      <CameraPreview videoRef={videoRef} />
      {errorMessage && (
        <ErrorDialog
          message={errorMessage}
          onClose={() => setErrorMessage('')}
          onUseMouse={() => {
            setErrorMessage('');
            chooseMouse();
          }}
        />
      )}
    </>
  );
}