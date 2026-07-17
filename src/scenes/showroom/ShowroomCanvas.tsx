import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Showroom } from './Showroom';
import { EXHIBIT_VIDEO_SRC, EXHIBIT_LABEL } from './constants';
import type { ExhibitTheme } from './textures';

/** 遷移進捗を、中央で最大になる山なりの強度カーブへ変換する。 */
function transitionStrength(progress: number): number {
  return Math.pow(Math.sin(progress * Math.PI), 0.86);
}

/** モーダルで開いている展示の情報。 */
type ActiveExhibit = { theme: ExhibitTheme; href: string };

/**
 * デジタルショールームのキャンバス。
 * ページ全体の背後に固定フル画面で 1 度だけマウントされ、
 * Hero / Meaning / Issue の背後に常駐する。ページ全体のスクロール進捗を
 * 1 つの ScrollTrigger でカメラの「空間への歩み」に変換する。
 *
 * 展示プレート（KV の 6 本の動画リンク）をクリックすると、その作品が
 * 正立方体になって画面中央へ移動し、クルクル回転してからモーダルへ変わる。
 */
export default function ShowroomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<ActiveExhibit | null>(null);
  // ポータルは初回マウント後（document が確実にある状態）にのみ描く。
  const [mounted, setMounted] = useState(false);
  // click ハンドラから最新の開閉状態を参照するための ref。
  const activeRef = useRef<ActiveExhibit | null>(null);
  activeRef.current = active;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new Showroom(canvas);
    scene.start();

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      scene.setPointer(x, y);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    const handTarget = document.createElement('button');
    handTarget.type = 'button';
    handTarget.hidden = true;
    handTarget.dataset.handExhibitTarget = '';
    handTarget.setAttribute('aria-label', '展示を見る');
    handTarget.addEventListener('click', () => scene.activateExhibit());
    document.body.append(handTarget);
    const onHandPointer = (e: Event) => {
      const detail = (e as CustomEvent<{ x: number; y: number; active: boolean }>).detail;
      if (!detail?.active) {
        scene.clearPointer();
        return;
      }
      scene.setPointer(
        (detail.x / window.innerWidth) * 2 - 1,
        (detail.y / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('showroom:hand-pointer', onHandPointer);

    // ポインタがウィンドウの外へ本当に出たときだけホバーを解除する。
    // （pointerout は要素間の移動でも発火するため relatedTarget で判定する）
    const onPointerLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) scene.clearPointer();
    };
    const onBlur = () => scene.clearPointer();
    window.addEventListener('pointerout', onPointerLeave, { passive: true });
    window.addEventListener('blur', onBlur);

    // 展示プレートをホバー中にクリックしたら、リンク遷移ではなく
    // 「正立方体になって中央で回転 → モーダル」の演出を開始する。
    // ただし実際のリンク / ボタンなど操作要素が重なっている場合と、
    // すでにモーダルが開いている場合は何もしない。
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, input, textarea, select, [role="button"]')) return;
      if (activeRef.current) return;
      scene.activateExhibit();
    };
    window.addEventListener('click', onClick);

    // Showroom 側でキューブの回転が終わると、このイベントでモーダルを開く。
    const onExhibitOpen = (e: Event) => {
      const detail = (e as CustomEvent<ActiveExhibit>).detail;
      if (detail) setActive(detail);
    };
    window.addEventListener('showroom:exhibit-open', onExhibitOpen);

    // CTA ボタンのホバーで、背後の粒子をボタンの青へ染める。
    const onCtaHover = (e: Event) => {
      const detail = (e as CustomEvent<{ on: boolean }>).detail;
      scene.setCtaTint(Boolean(detail?.on));
    };
    window.addEventListener('showroom:cta-hover', onCtaHover);

    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => scene.setScroll(self.progress),
    });
    triggers.push(trigger);

    // ページスクリプト (gravityTransitions.ts) と同じ汎用の境界ウィンドウ:
    // 隣り合う `.page > section` ペアごとに 1 つ、コンテンツ位置を基準に張る。
    const pageEl = document.querySelector<HTMLElement>('.page');
    const sections = pageEl
      ? Array.from(pageEl.querySelectorAll<HTMLElement>(':scope > section'))
      : [];
    sections.forEach((fromSection, index) => {
      const toSection = sections[index + 1];
      if (!toSection) return;
      const fromInner = fromSection.querySelector<HTMLElement>(':scope > [class*="__inner"]');
      const toInner = toSection.querySelector<HTMLElement>(':scope > [class*="__inner"]');
      if (!fromInner || !toInner) return;

      triggers.push(ScrollTrigger.create({
        trigger: fromSection,
        start: () =>
          fromSection.offsetTop + fromInner.offsetTop + fromInner.offsetHeight - window.innerHeight * 0.55,
        endTrigger: toSection,
        end: () => toSection.offsetTop + toInner.offsetTop - window.innerHeight,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scene.setGravity({
            strength: transitionStrength(self.progress),
            progress: self.progress,
            direction: self.direction >= 0 ? 1 : -1,
          });
        },
        onLeave: () => scene.setGravity({ strength: 0, progress: 1, direction: 1 }),
        onLeaveBack: () => scene.setGravity({ strength: 0, progress: 0, direction: -1 }),
      }));
    });

    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('showroom:hand-pointer', onHandPointer);
      window.removeEventListener('pointerout', onPointerLeave);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('click', onClick);
      window.removeEventListener('showroom:exhibit-open', onExhibitOpen);
      window.removeEventListener('showroom:cta-hover', onCtaHover);
      triggers.forEach((item) => item.kill());
      handTarget.remove();
      scene.dispose();
    };
  }, []);

  // モーダル表示中は背景スクロールを止め、Esc で閉じられるようにする。
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  const close = () => setActive(null);

  return (
    <>
      <canvas ref={canvasRef} className="showroom-canvas" aria-hidden="true" />
      {mounted && active
        ? createPortal(
            <div
              className="exhibit-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-label={`${EXHIBIT_LABEL[active.theme]} の作品`}
              onClick={close}
            >
              <div className="exhibit-modal" onClick={(e) => e.stopPropagation()}>
                <button className="exhibit-modal__close" type="button" onClick={close} aria-label="閉じる">
                  <span aria-hidden="true">×</span>
                </button>
                <div className="exhibit-modal__media">
                  <video
                    src={EXHIBIT_VIDEO_SRC[active.theme]}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
                <div className="exhibit-modal__body">
                  <p className="exhibit-modal__title">{EXHIBIT_LABEL[active.theme]}</p>
                  <a
                    className="exhibit-modal__visit"
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    サイトを見る
                  </a>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
