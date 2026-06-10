'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { CAM_START } from '@/components/hero-scene/constants'
import { HeroSceneScene } from '@/components/hero-scene/scene'
import type { HeroSceneProps } from '@/types/hero-scene'

export function HeroScene({
  progress,
  reduced = false,
}: HeroSceneProps) {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      camera={{ position: [0.6, 0, CAM_START], fov: 50 }}
    >
      <HeroSceneScene progress={progress} reduced={reduced} />
      {!reduced && (
        <EffectComposer>
          <Bloom
            intensity={0.55}
            luminanceThreshold={0.34}
            luminanceSmoothing={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  )
}
