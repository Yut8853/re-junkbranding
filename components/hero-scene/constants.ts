import * as THREE from 'three'
import type { LayerDef } from '@/types/hero-scene'

// 黒い空間 + 白い光。発光は控えめ（ネオン/ゲーム感を避ける）。
export const BG = '#06070b'
export const INK = new THREE.Color('#c9ced8')
export const WARM = new THREE.Color('#eef2f9')
export const BLOOM_INK = new THREE.Color('#eaf0ff').multiplyScalar(1.5)
export const BLOOM_WARM = new THREE.Color('#ffffff').multiplyScalar(1.7)

// カメラはゆっくり奥へ。派手に飛ばさないが、写真の中を一度だけ通り抜ける。
export const CAM_START = 6.0
export const CAM_END = -2.5

// 「写真の世界に入った瞬間」を作る区間（progress 基準）。
// この間に主役写真が拡大して画面外へ抜け、奥の光と空気が現れ、Meaning へ渡す。
export const ENTER_START = 0.24
export const ENTER_END = 0.46

// 写真は均等な板の列ではない。中央〜右に大きな主役の世界が1つ、
// その奥に他業種の断片がごく薄く漂うだけ。Hero は業種一覧ではなく世界観の入口。
export const LAYERS: LayerDef[] = [
  // 主役：入り込む1枚の世界（大きく・近く・中央右）。
  { photo: '/jp/cafe.png', role: 'main', pos: [1.9, 0, -0.8], rotY: -0.08, rotX: 0.01, h: 5.0, ar: 1.5, maxOpacity: 1 },
  // 奥の断片：他業種の気配。薄く・小さく・深く。
  { photo: '/jp/salon.png', role: 'fragment', pos: [-3.6, 1.8, -13.5], rotY: 0.22, rotX: 0.0, h: 2.0, ar: 0.82, maxOpacity: 0.24 },
  { photo: '/jp/craft.png', role: 'fragment', pos: [4.4, -2.1, -16.5], rotY: -0.24, rotX: 0.02, h: 2.2, ar: 1.4, maxOpacity: 0.2 },
  { photo: '/jp/clinic.png', role: 'fragment', pos: [-2.2, -1.4, -19.5], rotY: 0.18, rotX: 0.0, h: 2.0, ar: 1.45, maxOpacity: 0.16 },
]

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}