'use client'

import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { BG, LINES, PANELS } from '@/components/hero-scene/constants'
import {
  Atmosphere,
  GuideLine,
  Motes,
  PageGroup,
  Panel,
  Rig,
} from '@/components/hero-scene/parts'
import {
  makeGlowTexture,
  makePanelTexture,
  makePhotoTexture,
} from '@/components/hero-scene/textures'
import type { MotionProps } from '@/types/hero-scene'

export function HeroSceneScene({ progress, reduced }: MotionProps) {
  const glow = useMemo(() => makeGlowTexture(), [])
  const [textures, setTextures] = useState<Record<number, THREE.Texture>>({})

  useEffect(() => {
    let alive = true
    const made: THREE.Texture[] = []

    PANELS.forEach((def, i) => {
      if (def.kind === 'photo' && def.photo) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = def.photo
        const build = (image: HTMLImageElement | null) => {
          if (!alive) return
          const tex = makePhotoTexture(image, def.size[0] / def.size[1], false)
          made.push(tex)
          setTextures((prev) => ({ ...prev, [i]: tex }))
        }
        img.onload = () => build(img)
        img.onerror = () => build(null)
      } else if (def.kind !== 'photo') {
        const tex = makePanelTexture(def.kind, def.size[0], def.size[1])
        made.push(tex)
        setTextures((prev) => ({ ...prev, [i]: tex }))
      }
    })

    return () => {
      alive = false
      made.forEach((t) => t.dispose())
    }
  }, [])

  useEffect(() => () => glow.dispose(), [glow])

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 8, 32]} />
      <Atmosphere progress={progress} glow={glow} reduced={reduced} />
      <Motes progress={progress} glow={glow} reduced={reduced} />
      <PageGroup progress={progress} reduced={reduced}>
        {PANELS.map((def, i) => (
          <Panel
            key={i}
            def={def}
            texture={textures[i] ?? null}
            progress={progress}
            reduced={reduced}
          />
        ))}
        {LINES.map((def, i) => (
          <GuideLine key={i} def={def} progress={progress} reduced={reduced} />
        ))}
      </PageGroup>
      <Rig progress={progress} reduced={reduced} />
    </>
  )
}