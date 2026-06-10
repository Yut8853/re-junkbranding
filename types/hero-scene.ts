import type { MutableRefObject } from 'react'
import type * as THREE from 'three'

export type HeroSceneProgressRef = MutableRefObject<number>

export type LayerDef = {
  photo: string
  label: string
  pos: [number, number, number]
  rotY: number
  rotX: number
  h: number
  ar: number
  drift: number
  sweep: [number, number]
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
