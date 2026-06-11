import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * 入場アニメーション。
 *
 * - [data-reveal] 要素はビューポートに入った瞬間に一度だけフェードアップ。
 * - 散らばりギャラリー（[data-scatter-gallery]）はスクロールに同期して
 *   中央の 1 枚から全パネルが画面いっぱいに展開する。
 * - prefers-reduced-motion 時はアニメーションせず最終状態に固定する。
 */
export const initReveals = (reduced: boolean): void => {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const scatterGalleries = document.querySelectorAll<HTMLElement>('[data-scatter-gallery]');

  const scatterPanelsOf = (gallery: HTMLElement) =>
    Array.from(gallery.querySelectorAll<HTMLElement>('[data-scatter-panel]'));

  /** ギャラリーをアニメーションなしで最終配置（data-x/y/rotate/scale）に置く。 */
  const settleScatterGallery = (gallery: HTMLElement) => {
    scatterPanelsOf(gallery).forEach((panel) => {
      panel.style.opacity = '1';
      panel.style.transform = `
        translate3d(calc(-50% + ${panel.dataset.x}), calc(-50% + ${panel.dataset.y}), 0)
        rotate(${panel.dataset.rotate})
        scale(${panel.dataset.scale})
      `;
      panel.style.filter = 'none';
    });
  };

  if (reduced) {
    els.forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    scatterGalleries.forEach(settleScatterGallery);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ---- 単発のフェードアップ ----
  els.forEach((el) => {
    // セクション遷移側が管理する要素には二重にかけない。
    if (el.closest('[data-transition-to]')) return;

    const delay = Number(el.dataset.revealDelay ?? 0);
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%', // 要素上端がビューポート 82% 位置に来たら発火
          once: true,
        },
      },
    );
  });

  // ---- 散らばりギャラリーのスクロール連動展開 ----
  scatterGalleries.forEach((gallery) => {
    const panels = scatterPanelsOf(gallery);
    if (!panels.length) return;

    // 初期状態: 全パネルを中央に重ね、ぼかして隠しておく。
    gsap.set(panels, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      rotation: 0,
      scale: (index) => (index === 0 ? 0.72 : 0.58),
      autoAlpha: (index) => (index === 0 ? 0 : 0),
      filter: 'blur(10px)',
    });

    // scrub: 0.6 でスクロール位置に少し遅れて追従させる。
    const scatterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: gallery,
        start: 'top 68%',
        end: 'bottom 34%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    scatterTimeline
      // まず中央の 1 枚目だけがピントを結んで現れる。
      .to(panels[0], {
        autoAlpha: 1,
        scale: 0.96,
        filter: 'blur(0px)',
        duration: 0.22,
        ease: 'power2.out',
      })
      // 続いて全パネルが data 属性で指定された散らばり位置へ展開する。
      // stagger は中央から外側の順で時間差をつける。
      .to(panels, {
        x: (_index, target) => (target as HTMLElement).dataset.x ?? '0vw',
        y: (_index, target) => (target as HTMLElement).dataset.y ?? '0vh',
        rotation: (_index, target) => (target as HTMLElement).dataset.rotate ?? '0deg',
        scale: (_index, target) => Number((target as HTMLElement).dataset.scale ?? 1),
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: 0.78,
        stagger: { amount: 0.18, from: 'center' },
        ease: 'none',
      }, 0.22);
  });
};
