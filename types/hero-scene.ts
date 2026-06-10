import type { MutableRefObject } from 'react'
import type * as THREE from 'three'

export type HeroSceneProgressRef = MutableRefObject<number>

export type LayerRole = 'main' | 'fragment'

export type LayerDef = {
  photo: string
  role: LayerRole
  pos: [number, number, number]
  rotY: number
  rotX: number
  h: number
  ar: number
  /** 断片レイヤーの最大不透明度（主役は無視される）。 */
  maxOpacity: number
}

export type PhotoLayerProps = {
  def: LayerDef
  texture: THREE.Texture | null
  progress: HeroSceneProgressRef
  reduced: boolean
}

export type MotionProps = {
  progress: HeroSceneProgressRef
  reduced: boolean
}

export type AtmosphereProps = {
  progress: HeroSceneProgressRef
  glow: THREE.Texture
}

export type HeroSceneProps = {
  progress: HeroSceneProgressRef
  reduced?: boolean
}
