'use client'

import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { BG, LAYERS } from '@/components/hero-scene/constants'
import {
  Atmosphere,
  CloudField,
  Motes,
  PhotoLayer,
  Rig,
} from '@/components/hero-scene/parts'
import {
  makeCloudTexture,
  makeGlowTexture,
  makePhotoTexture,
} from '@/components/hero-scene/textures'
import type { MotionProps } from '@/types/hero-scene'

export function HeroSceneScene({
  progress,
  reduced,
}: MotionProps) {
  const glow = useMemo(() => makeGlowTexture(), [])
  const cloud = useMemo(() => makeCloudTexture(), [])
  const [textures, setTextures] = useState<Record<number, THREE.Texture>>({})

  useEffect(() => {
    let alive = true
    const made: THREE.Texture[] = []
    LAYERS.forEach((def, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = def.photo
      const build = (image: HTMLImageElement | null) => {
        if (!alive) return
        const tex = makePhotoTexture(image, def.ar, def.role === 'fragment')
        made.push(tex)
        setTextures((prev) => ({ ...prev, [i]: tex }))
      }
      img.onload = () => build(img)
      img.onerror = () => build(null)
    })
    return () => {
      alive = false
      made.forEach((t) => t.dispose())
    }
  }, [])

  useEffect(
    () => () => {
      glow.dispose()
      cloud.dispose()
    },
    [cloud, glow],
  )

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 8, 30]} />
      <Atmosphere progress={progress} glow={glow} />
      <CloudField texture={cloud} progress={progress} reduced={reduced} />
      <Motes progress={progress} glow={glow} reduced={reduced} />
      {LAYERS.map((def, i) => (
        <PhotoLayer
          key={i}
          def={def}
          texture={textures[i] ?? null}
          progress={progress}
          reduced={reduced}
        />
      ))}
      <Rig progress={progress} reduced={reduced} />
    </>
  )
}