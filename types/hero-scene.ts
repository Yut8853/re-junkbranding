import type { MutableRefObject, ReactNode } from 'react'
import type * as THREE from 'three'

export type HeroSceneProgressRef = MutableRefObject<number>

// 1枚のWebページを構成する面（写真・見出し・本文・CTA・背景面）。
// flat = 平面状態の座標、depth/drift = 分解時に奥行き方向へ広がるオフセット。
export type PanelKind = 'bg' | 'photo' | 'heading' | 'body' | 'cta'

export type PanelDef = {
  kind: PanelKind
  flat: [number, number, number]
  depth: number
  drift: [number, number]
  size: [number, number]
  opacity: number
  photo?: string
}

// 余白・導線を表す細いライン。分解とともに現れる。
export type LineDef = {
  flat: [number, number, number]
  depth: number
  drift: [number, number]
  size: [number, number]
  opacity: number
}

export type MotionProps = {
  progress: HeroSceneProgressRef
  reduced: boolean
}

export type PanelProps = MotionProps & {
  def: PanelDef
  texture: THREE.Texture | null
}

export type LineProps = MotionProps & {
  def: LineDef
}

export type PageGroupProps = MotionProps & {
  children: ReactNode
}

export type AtmosphereProps = MotionProps & {
  glow: THREE.Texture
}

export type HeroSceneProps = {
  progress: HeroSceneProgressRef
  reduced?: boolean
}

