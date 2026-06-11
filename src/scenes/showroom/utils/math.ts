/* 数値ユーティリティ。フレームループ内で多用する軽量関数のみ置く。 */

/** 値を 0..1 の範囲に収める。 */
export function clamp01(v: number): number {
  return Math.min(Math.max(v, 0), 1);
}

/** GLSL の smoothstep と同じ。e0..e1 の間を 0..1 へ滑らかに補間する。 */
export function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** 線形補間。t=0 で a、t=1 で b。 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
