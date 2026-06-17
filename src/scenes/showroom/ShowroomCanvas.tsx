import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Showroom } from './Showroom';

/** 遷移進捗を、中央で最大になる山なりの強度カーブへ変換する。 */
function transitionStrength(progress: number): number {
  return Math.pow(Math.sin(progress * Math.PI), 0.86);
}

/**
 * デジタルショールームのキャンバス。
 * ページ全体の背後に固定フル画面で 1 度だけマウントされ、
 * Hero / Meaning / Issue の背後に常駐する。ページ全体のスクロール進捗を
 * 1 つの ScrollTrigger でカメラの「空間への歩み」に変換する。
 */
export default function ShowroomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // ポインタがウィンドウの外へ本当に出たときだけホバーを解除する。
    // （pointerout は要素間の移動でも発火するため relatedTarget で判定する）
    const onPointerLeave = (e: PointerEvent) => {
      if (!e.relatedTarget) scene.clearPointer();
    };
    const onBlur = () => scene.clearPointer();
    window.addEventListener('pointerout', onPointerLeave, { passive: true });
    window.addEventListener('blur', onBlur);

    // 展示プレートをホバー中にクリックしたら、同一タブでリンク先へ遷移する。
    // ただし実際のリンク / ボタンなど操作要素が重なっている場合はそちらを優先する。
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a, button, input, textarea, select, [role="button"]')) return;
      const href = scene.getHoveredHref();
      if (href) window.location.href = href;
    };
    window.addEventListener('click', onClick);

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
      window.removeEventListener('pointerout', onPointerLeave);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('click', onClick);
      triggers.forEach((item) => item.kill());
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="showroom-canvas" aria-hidden="true" />;
}
