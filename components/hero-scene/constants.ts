import * as THREE from 'three'
import type { LayerDef } from '@/types/hero-scene'

// 黒い空間 + 白い光。発光は控えめ（ネオン/ゲーム感を避ける）。
export const BG = '#06070b'
export const INK = new THREE.Color('#c9ced8')
export const WARM = new THREE.Color('#eef2f9')
export const BLOOM_INK = new THREE.Color('#eaf0ff').multiplyScalar(1.5)
export const BLOOM_WARM = new THREE.Color('#ffffff').multiplyScalar(1.7)

// カメラはゆっくり奥へ。派手に飛ばさない短い旅程。
export const CAM_START = 5.0
export const CAM_END = -4.5
export const OPENING_PHOTO_PRESENCE = 0.5

// 写真は「カード」ではなく空間の断片。右側に寄せ、左のコピー領域は常に空ける。
// 近景1・中景2・遠景1の4枚に絞る。
export const LAYERS: LayerDef[] = [
  // 近景：飲食の手元・カウンター（メイン）
  { photo: '/jp/cafe.png', label: '', pos: [2.7, -0.15, -1.2], rotY: -0.16, rotX: 0.02, h: 3.5, ar: 1.5, drift: 0.05, sweep: [1.6, -0.3] },
  // 中景：サロンの空間
  { photo: '/jp/salon.png', label: '', pos: [3.9, 1.5, -4.2], rotY: -0.22, rotX: 0.0, h: 2.7, ar: 0.82, drift: 0.06, sweep: [1.8, 0.6] },
  // 中景：町工場の手元・道具
  { photo: '/jp/craft.png', label: '', pos: [3.1, -1.5, -6.4], rotY: -0.18, rotX: 0.03, h: 2.5, ar: 1.4, drift: 0.07, sweep: [1.6, -0.6] },
  // 遠景：落ち着いた空間
  { photo: '/jp/clinic.png', label: '', pos: [2.4, 0.7, -9.6], rotY: -0.16, rotX: 0.0, h: 2.3, ar: 1.45, drift: 0.08, sweep: [1.2, 0.4] },
]

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}