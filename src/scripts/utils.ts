/** 値を 0..1 の範囲に収める。 */
export const clamp01 = (value: number): number => Math.min(Math.max(value, 0), 1);

/**
 * GLSL の smoothstep と同じ補間。
 * edge0 で 0、edge1 で 1 になり、間は S 字カーブ（3t² - 2t³）で滑らかに繋ぐ。
 */
export const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
