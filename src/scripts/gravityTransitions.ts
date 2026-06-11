import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { smoothstep } from './utils';

/**
 * セクション境界の「重力」遷移。
 *
 * 汎用の境界システム: `.page > section` の隣り合うペアすべてに
 * 重力遷移を 1 つずつ張る。アンカーはセクションの offsetTop ではなく
 * 実際のコンテンツ位置（重なりマージンの影響を受けない）。
 * 出ていくセクションは下へ引かれて引き伸ばされ、入ってくるセクションは
 * 引き込まれ、テキストには色収差つきのストレッチがかかる——
 * すべてスクロールに同期（scrub）。同じ瞬間の WebGL 側の演出は
 * ShowroomCanvas の重力入力を通じて別経路で駆動される。
 */
export const initGravityTransitions = (reduced: boolean): void => {
  if (reduced) return;

  const page = document.querySelector<HTMLElement>('.page');
  if (!page) return;

  gsap.registerPlugin(ScrollTrigger);

  const sections = Array.from(page.querySelectorAll<HTMLElement>(':scope > section'));
  const innerOf = (section: HTMLElement) =>
    section.querySelector<HTMLElement>(':scope > [class*="__inner"]');
  const scrimOf = (section: HTMLElement) =>
    section.querySelector<HTMLElement>(':scope > [class*="__scrim"]');

  sections.forEach((fromSection, index) => {
    const toSection = sections[index + 1];
    if (!toSection) return;

    const fromInner = innerOf(fromSection);
    const toInner = innerOf(toSection);
    if (!fromInner || !toInner) return;

    const fromScrim = scrimOf(fromSection);
    const fromText = Array.from(fromInner.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );
    const toText = Array.from(toInner.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    // data-gravity-bottom-only が付いたセクション（サービス一覧のような
    // 文字密度の高いものや、散らばりギャラリーのような非常に縦長のもの）は
    // 読ませる本体を安定させる: 歪みの基点を「上端」に固定して下端側にだけ
    // 効かせ、密度の高いテキスト子要素は歪ませず、ブロック全体のブラーも
    // 切る。境界の引き込み自体はそのまま再生される。
    const fromBottomOnly = fromSection.hasAttribute('data-gravity-bottom-only');
    const toBottomOnly = toSection.hasAttribute('data-gravity-bottom-only');
    const fromInnerOrigin = fromBottomOnly ? '50% 0%' : '50% 64%';
    const toInnerOrigin = toBottomOnly ? '50% 0%' : '50% 30%';
    const fromInnerStretch = fromBottomOnly ? 0.12 : 0.34;
    const toInnerStretch = toBottomOnly ? 0.06 : 0.16;
    const fromInnerBlurMax = fromBottomOnly ? 0 : 0.62;
    const toInnerBlurMax = toBottomOnly ? 0 : 0.26;
    const fromTextTargets = fromBottomOnly ? [] : fromText;
    const toTextTargets = toBottomOnly ? [] : toText;
    const shadowTargets = [...fromTextTargets, ...toTextTargets];

    // 入ってくるコンテンツがビューポートに現れる直前で終わらせ、
    // 次のセクションが見えるときには演出が完全に終わっているようにする。
    const endPx = () => toSection.offsetTop + toInner.offsetTop - window.innerHeight;

    // filter / textShadow などペイント負荷の高いプロパティは、
    // tension が目に見える段差を跨いだときだけ書き換える（ペアごとに追跡）。
    let lastTensionBucket = -1;

    ScrollTrigger.create({
      trigger: fromSection,
      // 出ていくコンテンツがビューポート上半分から抜け始めたら開始。
      // 画面中央にまだ居座っている間は決して始めない。
      start: () => {
        const contentStart =
          fromSection.offsetTop + fromInner.offsetTop + fromInner.offsetHeight - window.innerHeight * 0.55;
        const end = endPx();
        // コンテンツが中央配置の縦長セクション（150svh の散らばり
        // ギャラリーなど）では、コンテンツ基準の start が境界基準の end を
        // 追い越して窓が潰れ、遷移が死ぬことがある。最低限使える
        // スクロール幅を確保する。
        return end > contentStart ? contentStart : end - window.innerHeight * 0.75;
      },
      endTrigger: toSection,
      end: endPx,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const viewport = window.innerHeight;
        // 中央で最大になる山なりの強度。
        const blendAmount = Math.sin(progress * Math.PI);
        // 前半→後半の主導権の受け渡し（0.24..0.78 で 0→1）。
        const handoff = smoothstep(0.24, 0.78, progress);
        // 終盤の弾性的な戻り（引かれた分がわずかに跳ね返る）。
        const returnPhase = smoothstep(0.58, 1, progress);
        const elasticReturn = returnPhase * Math.sin(returnPhase * Math.PI) * viewport * 0.024;
        const pullY = blendAmount * viewport * 0.4 - elasticReturn;
        const tension = Math.pow(blendAmount, 1.6);
        // テキストはセクション本体より早く反応し（指数が小さいほど
        // 立ち上がりが早い）、はるかに大きく伸びる。
        const textTension = Math.pow(blendAmount, 0.55);
        // 高周波の揺さぶり（グリッチの「ガタつき」成分）。
        const glitchKick = tension * Math.sin(progress * Math.PI * 9);

        // --meaning-rise は CSS が実際に読む唯一のカスタムプロパティ。
        // 他の書き込みは毎フレーム style 再計算を強いるだけの死荷重だった。
        page.style.setProperty('--meaning-rise', `${((1 - handoff) * 3.5).toFixed(3)}rem`);

        // transform のみ（GPU 合成で安価）は毎フレーム実行する。
        gsap.set(fromSection, {
          y: -progress * 26 + pullY * 0.08,
          scaleY: 1 + tension * 0.06,
          transformOrigin: '50% 72%',
        });
        gsap.set(toSection, {
          y: -pullY * 0.16,
          autoAlpha: 0.9 + handoff * 0.1,
          scaleY: 1 + tension * 0.06,
          transformOrigin: '50% 22%',
        });
        if (fromScrim) {
          gsap.set(fromScrim, {
            y: pullY * 0.5,
            scaleY: 1 + blendAmount * 0.8,
            autoAlpha: 0.86 - progress * 0.3,
            transformOrigin: 'bottom center',
          });
        }
        gsap.set(fromInner, {
          y: -progress * 30 + pullY * 0.3,
          scaleY: 1 + tension * fromInnerStretch,
          scaleX: 1 - tension * 0.035,
          skewY: -blendAmount * 0.28 + glitchKick * 0.16,
          autoAlpha: 1 - progress * 0.3,
          transformOrigin: fromInnerOrigin,
        });
        gsap.set(toInner, {
          y: (1 - handoff) * 42 - pullY * 0.16,
          scaleY: 1 + tension * toInnerStretch,
          scaleX: 1 - tension * 0.02,
          skewY: blendAmount * 0.2 * (progress < 0.5 ? 1 : -1),
          autoAlpha: 0.86 + handoff * 0.14,
          transformOrigin: toInnerOrigin,
        });
        gsap.set(fromTextTargets, {
          y: pullY * 0.08,
          scaleY: 1 + textTension * 2.4,
          x: glitchKick * 3,
        });
        gsap.set(toTextTargets, {
          y: -pullY * 0.06,
          scaleY: 1 + textTension * 1.6,
          x: glitchKick * -2.4,
        });

        // ブラー / 彩度フィルターと多層テキストシャドウはペイントを
        // 引き起こす高コスト部分。tension が目に見える段差（1/36）を
        // 跨いだときだけ再構築・書き込みする——毎フレームではなく。
        // これが見た目を変えずに動きを滑らかにしている要点。
        const tensionBucket = Math.round(tension * 36);
        if (tensionBucket !== lastTensionBucket) {
          lastTensionBucket = tensionBucket;
          // 白 / 青 / 発光 / 黒の 4 層シャドウで色収差を作る。
          const chromaShadow = [
            `${(-7 * tension).toFixed(2)}px ${(2 * tension).toFixed(2)}px 0 rgba(238, 246, 255, ${Math.min(0.3, tension * 0.3).toFixed(3)})`,
            `${(8 * tension).toFixed(2)}px ${(-2 * tension).toFixed(2)}px 0 rgba(64, 104, 255, ${Math.min(0.24, tension * 0.24).toFixed(3)})`,
            `0 ${(18 * tension).toFixed(2)}px ${(34 * tension).toFixed(2)}px rgba(232, 240, 255, ${Math.min(0.28, tension * 0.28).toFixed(3)})`,
            '0 1px 40px rgba(6, 7, 11, 0.6)',
          ].join(', ');
          gsap.set(fromInner, {
            filter: `blur(${(tension * fromInnerBlurMax).toFixed(2)}px) saturate(${(1 + tension * 0.42).toFixed(3)})`,
          });
          gsap.set(toInner, {
            filter: `blur(${(tension * toInnerBlurMax).toFixed(2)}px) saturate(${(1 + tension * 0.22).toFixed(3)})`,
          });
          gsap.set(shadowTargets, { textShadow: chromaShadow });
        }
      },
    });
  });
};
