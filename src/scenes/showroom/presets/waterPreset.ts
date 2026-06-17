import type { WaterColorParams, WaterParams } from '../types';

/* ============================================================
 * 海（floor シェーダー）のプリセット値。
 * 現在の表現を固定値として管理し、Showroom.ts から実行時パラメータへ複製する。
 * 型 WaterPreset は types.ts 側に定義している。
 * ============================================================ */

/** 海の形状・揺れ・フェードのプリセット。 */
export const WATER_PRESET = {
  /** 波の歪み強度。three.js ocean サンプルの distortionScale 相当。 */
  distortionScale: 3.7,
  /** 法線テクスチャのスケール（波の細かさ）。 */
  size: 1.15,
  /** time ユニフォームの進み速度。 */
  normalSpeed: 0.38,
  /** 透明度。 */
  alpha: 0.95,
  /** 夜光虫イベント時に distortionScale へ乗せる増幅量。 */
  wavePulseBoost: 1.8,
  /** 太陽反射色の強度。 */
  sunColorIntensity: 1.0,

  /** ポインタ視差の強さ（0 = 無効）。 */
  parallaxStrength: 0,
  /** スクロールでカメラが前進する量（1 = フル）。 */
  cameraForwardAmount: 1,
} as const;

/** 海の配色プリセット。 */
export const WATER_COLOR_PRESET = {
  water: '#17465f',
  sun: '#ffe5ba',
} as const;

/** WATER_PRESET の書き換え可能なコピーを返す（GUI 編集用の実行時状態）。 */
export function cloneWaterPreset(): WaterParams {
  return { ...WATER_PRESET };
}

/** WATER_COLOR_PRESET の書き換え可能なコピーを返す。 */
export function cloneWaterColors(): WaterColorParams {
  return { ...WATER_COLOR_PRESET };
}
