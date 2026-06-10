import * as THREE from 'three'
import type { LayerDef } from '@/types/hero-scene'

export const BG = '#050608'
export const INK = new THREE.Color('#d8dce5')
export const AMBER = new THREE.Color('#f3f6fb')
export const WARM = new THREE.Color('#f7f9ff')
export const BLOOM_INK = new THREE.Color('#f2f6ff').multiplyScalar(1.95)
export const BLOOM_AMBER = new THREE.Color('#ffffff').multiplyScalar(2.2)
export const BLOOM_WARM = new THREE.Color('#ffffff').multiplyScalar(2.05)

export const CAM_START = 5.8
export const CAM_END = -14.5
export const OPENING_PHOTO_PRESENCE = 0.38

export const LAYERS: LayerDef[] = [
  { photo: '/jp/cafe.png', label: '飲食 / Restaurant', pos: [2.0, 0.1, -0.5], rotY: -0.18, rotX: 0.02, h: 3.2, ar: 1.5, drift: 0.1, sweep: [3.6, -0.6] },
  { photo: '/jp/salon.png', label: '美容 / Salon', pos: [4.6, 1.7, -2.6], rotY: -0.28, rotX: 0.0, h: 2.8, ar: 0.78, drift: 0.14, sweep: [4.2, 1.6] },
  { photo: '/jp/craft.png', label: 'ものづくり / Craft', pos: [-2.4, -1.6, -4.2], rotY: 0.2, rotX: 0.05, h: 2.6, ar: 1.4, drift: 0.14, sweep: [-4.0, -1.8] },
  { photo: '/jp/clinic.png', label: '医療 / Clinic', pos: [3.6, -0.6, -6.4], rotY: -0.26, rotX: 0.0, h: 2.6, ar: 1.45, drift: 0.16, sweep: [4.0, -1.4] },
  { photo: '/jp/store.png', label: '店舗 / Store', pos: [-2.2, 1.8, -8.4], rotY: 0.14, rotX: 0.02, h: 2.5, ar: 1.5, drift: 0.18, sweep: [-3.8, 2.0] },
  { photo: '/jp/farm.png', label: '農業 / Agriculture', pos: [2.4, -1.0, -10.6], rotY: -0.16, rotX: 0.03, h: 2.4, ar: 1.5, drift: 0.2, sweep: [3.4, -1.6] },
  { photo: '/jp/personal.png', label: '個人ブランド / Creator', pos: [-1.2, 0.6, -12.8], rotY: 0.1, rotX: 0.0, h: 2.2, ar: 1.3, drift: 0.22, sweep: [-3.0, 1.2] },
]

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}