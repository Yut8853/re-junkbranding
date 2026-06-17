import { clamp01, smoothstep } from './utils';

/**
 * アンビエントミュージックのドック（右下トグル + 左下の案内）。
 *
 * 自動再生: 左下の案内が「ページ操作で音楽が始まる」ことを伝え、
 * 最初の操作（マウス移動・スクロール・タップ・キー押下）で再生を試みる。
 * 以降は右下のボタンが ON/OFF を完全に管理する。
 * 音量の変化は常にフェード（420ms）を通す。
 */
export const initMusic = (): void => {
  const musicToggle = document.querySelector<HTMLButtonElement>(
    '[data-music-toggle]'
  );
  const musicLoop =
    document.querySelector<HTMLAudioElement>('[data-music-loop]');
  if (!musicToggle || !musicLoop) return;
  const musicDock = document.querySelector<HTMLElement>('[data-music-dock]');

  let fadeFrame = 0;
  /** 現在音量から target へ smoothstep カーブでフェードする。 */
  const fadeVolume = (target: number, onDone?: () => void) => {
    cancelAnimationFrame(fadeFrame);

    const start = musicLoop.volume;
    const startedAt = performance.now();
    const duration = 420;
    const tick = (now: number) => {
      const progress = clamp01((now - startedAt) / duration);
      musicLoop.volume = start + (target - start) * smoothstep(0, 1, progress);

      if (progress < 1) {
        fadeFrame = requestAnimationFrame(tick);
        return;
      }

      onDone?.();
    };

    fadeFrame = requestAnimationFrame(tick);
  };

  /** トグルボタンの見た目とアクセシビリティ属性を ON/OFF 状態に同期する。 */
  const setMusicState = (isOn: boolean) => {
    musicToggle.classList.toggle('is-on', isOn);
    musicToggle.setAttribute('aria-pressed', String(isOn));
    musicToggle.setAttribute('aria-label', isOn ? '音楽を停止' : '音楽を再生');
  };

  musicLoop.volume = 0;
  setMusicState(false);

  const musicNotice = document.querySelector<HTMLElement>(
    '[data-music-notice]'
  );
  const hideMusicNotice = () => musicNotice?.classList.add('is-hidden');

  /** 再生開始（フェードイン）。ブラウザにブロックされたら onBlocked へ。 */
  const startMusic = (onBlocked?: () => void) => {
    setMusicState(true);
    fadeVolume(0.42);
    void musicLoop
      .play()
      .then(hideMusicNotice)
      .catch(() => {
        setMusicState(false);
        fadeVolume(0);
        onBlocked?.();
      });
  };

  /** フェードアウトしてから pause する停止処理。 */
  const stopMusic = () => {
    setMusicState(false);
    fadeVolume(0, () => musicLoop.pause());
  };

  // 自動再生のきっかけとして拾う操作イベント。
  const autoStartEvents = [
    'pointermove',
    'pointerdown',
    'click',
    'keydown',
    'touchstart',
    'touchend',
    'wheel',
    'scroll',
  ] as const;
  // ブラウザが「ユーザー操作（gesture）」として認めるイベント。
  // これらの発生中は音付き再生の許可が下りるため、クールダウンを無視して必ず試行する。
  const gestureEvents = new Set([
    'pointerdown',
    'click',
    'keydown',
    'touchend',
  ]);
  let autoStarted = false;
  let retryBlockedUntil = 0;
  const removeAutoStart = () => {
    for (const type of autoStartEvents)
      window.removeEventListener(type, tryAutoStart);
  };
  const tryAutoStart = (event: Event) => {
    if (autoStarted) return;
    // ジェスチャーイベント、または既にページのどこかを操作済み（再生許可が出る見込みがある）
    // の場合はクールダウンを無視して即試行する。
    const likelyAllowed =
      gestureEvents.has(event.type) ||
      (navigator.userActivation?.hasBeenActive ?? false);
    if (!likelyAllowed && performance.now() < retryBlockedUntil) return;
    // UIコントロール上の操作は各ボタンの役割に任せるため無視する。
    if (
      event.target instanceof Node &&
      ((event.target instanceof Element &&
        event.target.closest('[data-music-autostart-ignore]')) ||
        (musicDock?.contains(event.target) ??
          musicToggle.contains(event.target)))
    )
      return;
    autoStarted = true;
    removeAutoStart();
    startMusic(() => {
      // この操作（mousemove や scroll など）では再生許可が下りなかった。
      // 諦めずに次の操作を待つ。ただし 600ms のクールダウンを挟み、
      // 拒否された試行が毎フレーム連発しないようにする。
      autoStarted = false;
      retryBlockedUntil = performance.now() + 600;
      for (const type of autoStartEvents) {
        window.addEventListener(type, tryAutoStart, { passive: true });
      }
    });
  };
  for (const type of autoStartEvents) {
    window.addEventListener(type, tryAutoStart, { passive: true });
  }

  // 手動トグル: 以降の自動再生は解除し、案内も消す。
  musicToggle.addEventListener('click', () => {
    autoStarted = true;
    removeAutoStart();
    hideMusicNotice();

    if (musicLoop.paused) {
      startMusic();
      return;
    }

    stopMusic();
  });

  // 別タブ・別ウィンドウを見ている間は音楽を止め、戻ってきたら再開する。
  // resumeOnVisible は「非表示にする直前に鳴っていたか」を覚えておくフラグ。
  let resumeOnVisible = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // 鳴っている場合だけ覚えて即停止する。
      // 注意: 非表示タブでは requestAnimationFrame が停止するため、
      // フェード（stopMusic）に頼ると pause() が呼ばれず鳴りっぱなしになる。
      // ここではフェードを使わず直接 pause する。
      resumeOnVisible =
        musicToggle.classList.contains('is-on') && !musicLoop.paused;
      if (resumeOnVisible) {
        cancelAnimationFrame(fadeFrame);
        musicLoop.pause();
        musicLoop.volume = 0;
      }
      return;
    }
    // タブに戻った: 離脱前に鳴っていたときだけ再開する。
    if (resumeOnVisible) {
      resumeOnVisible = false;
      startMusic();
    }
  });
};
