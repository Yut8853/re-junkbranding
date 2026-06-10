import * as THREE from 'three'
import type { LineDef, PanelDef } from '@/types/hero-scene'

// 黒に近い空間 + 白い光。発光は控えめ（ネオン/ゲーム感を避ける）。
export const BG = '#06070b'
export const INK = new THREE.Color('#c9ced8')
export const WARM = new THREE.Color('#eef2f9')
export const BLOOM_INK = new THREE.Color('#eaf0ff').multiplyScalar(1.4)
export const BLOOM_WARM = new THREE.Color('#ffffff').multiplyScalar(1.6)

// カメラは「平面のWebページ」を正面から眺める位置から、
// 分解された層の“間”へ静かに入っていく。派手な飛行はしない。
export const CAM_START = 6.0
export const CAM_END = 3.2

// 分解（平面 → 奥行き空間）が進む区間。progress 基準。
// Hero〜Bridge にかけて 0→1。スクロールに自然同期。
export const EXPLODE_START = 0.04
export const EXPLODE_END = 0.62

// Webページの中心位置（右側）。左側はコピーの安全領域として常に空ける。
export const PAGE_X = 3.0

// 1枚のWebページ。平面状態(flat)では写真・見出し・本文・CTA・背景が
// 1枚に重なって見え、分解(depth/drift)で奥行きのある層へ解体される。
// 写真は主役ではなく、ページを構成する1レイヤーとして扱う（1枚だけ）。
export const PANELS: PanelDef[] = [
  // 背景面：ページの土台。奥へ退いて空間の床になる。
  { kind: 'bg', flat: [0, 0, 0], depth: -4.0, drift: [0, 0], size: [4.0, 6.0], opacity: 0.7 },
  // 写真：ページ上部のビジュアル。中景へ。
  { kind: 'photo', flat: [0, 1.55, 0.05], depth: -1.7, drift: [-0.35, 0.25], size: [3.3, 2.0], opacity: 1, photo: '/jp/cafe.png' },
  // 見出し：手前へ浮き上がる。
  { kind: 'heading', flat: [0, 0.05, 0.1], depth: 0.5, drift: [0.15, 0.05], size: [2.9, 0.7], opacity: 0.95 },
  // 本文：さらに手前。
  { kind: 'body', flat: [0, -0.95, 0.14], depth: 1.0, drift: [0.2, -0.1], size: [3.0, 1.2], opacity: 0.85 },
  // CTA：最前面。
  { kind: 'cta', flat: [-0.75, -2.05, 0.18], depth: 1.6, drift: [0.25, -0.15], size: [1.5, 0.5], opacity: 1 },
]

// 余白・導線。平面では見えず、分解とともに細い線として現れる。
export const LINES: LineDef[] = [
  { flat: [-1.75, -0.2, 0.08], depth: 0.3, drift: [-0.1, 0], size: [0.014, 5.2], opacity: 0.45 },
  { flat: [0, 0.5, 0.08], depth: -0.5, drift: [0, 0.1], size: [3.3, 0.014], opacity: 0.4 },
  { flat: [0.6, -1.2, 0.16], depth: 1.2, drift: [0.15, -0.05], size: [0.012, 2.0], opacity: 0.3 },
]

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}