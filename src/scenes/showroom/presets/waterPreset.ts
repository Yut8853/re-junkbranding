import type { WaterColorParams, WaterParams } from '../types';

/* ============================================================
 * 海（floor シェーダー）のプリセット値。
 * lil-gui で調整した結果を「Copy sky + sea JSON」で書き出し、
 * ここへ貼り戻して保存する運用。
 * 型 WaterPreset は types.ts 側に定義している。
 * ============================================================ */

/** 海の形状・揺れ・フェードのプリセット。 */
export const WATER_PRESET = {
  /** うねりの高さ。 */
  waveStrength: 0.42,
  /** うねりの細かさ（大きいほど波長が短い）。 */
  waveScale: 22.3,
  /** うねりの流れる速さ。 */
  waveSpeed: 0.524,
  /** さざ波の高さ。 */
  rippleStrength: 0.105,
  /** さざ波の細かさ。 */
  rippleScale: 23.5,
  /** さざ波の流れる速さ。 */
  rippleSpeed: 0.631,
  /** 海流の向き X 成分。 */
  flowDirectionX: 0,
  /** 海流の向き Y 成分（1 = 奥から手前へ）。 */
  flowDirectionY: 1,
  /** 波頭ラインの柔らかさ（1 に近いほど細く鋭い）。 */
  crestSoftness: 0.73,

  /** スクロールに応じた露出減衰を海へ反映する割合。 */
  fogStrength: 0.34,
  /** 遠景を地平線へ溶かすフェード量。 */
  horizonFade: 0.36,
  /** 画面端を暗くするビネット量。 */
  vignetteStrength: 0.24,
  /** 深い水の暗さ。 */
  depthDarkness: 0.18,

  /** ポインタ視差の強さ（0 = 無効）。 */
  parallaxStrength: 0,
  /** スクロールでカメラが前進する量（1 = フル）。 */
  cameraForwardAmount: 1,

  /** デバッグ: 中央ガイドラインの表示。 */
  showGuides: false,
  /** デバッグ: 水の構造のみ表示。 */
  showWaterOnly: false,
} as const;

/** 海の配色プリセット。 */
export const WATER_COLOR_PRESET = {
  base: '#1d506f',
  shallow: '#6ea5bd',
  crest: '#ffd18a',
  brightness: 1.34,
} as const;

/** WATER_PRESET の書き換え可能なコピーを返す（GUI 編集用の実行時状態）。 */
export function cloneWaterPreset(): WaterParams {
  return { ...WATER_PRESET };
}

/** WATER_COLOR_PRESET の書き換え可能なコピーを返す。 */
export function cloneWaterColors(): WaterColorParams {
  return { ...WATER_COLOR_PRESET };
}
