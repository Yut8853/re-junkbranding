'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  BLOOM_AMBER,
  BLOOM_INK,
  BLOOM_WARM,
  CAM_END,
  CAM_START,
  INK,
  OPENING_PHOTO_PRESENCE,
  smoothstep,
} from '@/components/hero-scene/constants'
import type {
  AtmosphereProps,
  MotionProps,
  PhotoLayerProps,
} from '@/types/hero-scene'

export function PhotoLayer({
  def,
  texture,
  progress,
  reduced,
}: PhotoLayerProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const { camera } = useThree()
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state, delta) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return

    const camZ = camera.position.z
    const ahead = camZ - def.pos[2]
    const reveal = smoothstep(15, 9.5, ahead)
    const opening =
      (1 - smoothstep(0.04, 0.28, progress.current)) * smoothstep(24, 12, ahead)
    const presence = Math.max(reveal, opening * OPENING_PHOTO_PRESENCE)
    const pass = reduced ? 0 : smoothstep(3.2, -0.6, ahead)
    const passFade = smoothstep(-1.2, 1.6, ahead)
    const baseTex = texture ? 1 : 0

    m.opacity +=
      (baseTex * presence * passFade - m.opacity) * Math.min(1, delta * 4)

    const t = state.clock.elapsedTime
    const fx = reduced ? 0 : Math.cos(t * 0.3 + phase) * def.drift * 0.5
    const fy = reduced ? 0 : Math.sin(t * 0.4 + phase) * def.drift
    const approach = (1 - presence) * -1.2

    g.position.x = def.pos[0] + def.sweep[0] * pass + fx
    g.position.y = def.pos[1] + def.sweep[1] * pass + fy
    g.position.z = def.pos[2] + approach
    g.rotation.y = def.rotY - def.sweep[0] * 0.04 * pass
    g.rotation.x = def.rotX
  })

  return (
    <group ref={group} position={def.pos} rotation={[def.rotX, def.rotY, 0]}>
      <mesh scale={[def.h * def.ar, def.h, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={mat}
          map={texture ?? undefined}
          transparent
          opacity={0}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export function Motes({
  progress,
  glow,
  reduced,
}: MotionProps & {
  glow: THREE.Texture
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const bloom = useRef<THREE.InstancedMesh>(null)
  const count = 260
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const glowDummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      s: number
      speed: number
      phase: number
      amber: boolean
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.5) * 11,
        z: CAM_START - Math.random() * 32,
        s: 0.018 + Math.random() * 0.055,
        speed: 0.65 + Math.random() * 1.35,
        phase: Math.random() * Math.PI * 2,
        amber: Math.random() < 0.28,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const mesh = ref.current
    const glowMesh = bloom.current
    if (!mesh || !glowMesh) return
    const col = new THREE.Color()
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z)
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      glowDummy.position.set(d.x, d.y, d.z)
      glowDummy.scale.setScalar(d.s * 2.8)
      glowDummy.updateMatrix()
      glowMesh.setMatrixAt(i, glowDummy.matrix)

      col.copy(d.amber ? BLOOM_AMBER : BLOOM_INK)
      mesh.setColorAt(i, col)
      glowMesh.setColorAt(i, col)
    })
    mesh.instanceMatrix.needsUpdate = true
    glowMesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    if (glowMesh.instanceColor) glowMesh.instanceColor.needsUpdate = true
  }, [data, dummy, glowDummy])

  useFrame((state, delta) => {
    const mesh = ref.current
    const glowMesh = bloom.current
    if (!mesh || !glowMesh) return
    const camZ = state.camera.position.z
    const farZ = camZ - 34
    const nearZ = camZ + 2.8
    const stream = reduced ? 0.35 : 1.2 + progress.current * 4.2
    let changed = false
    data.forEach((d, i) => {
      d.z += delta * stream * d.speed
      if (d.z > nearZ) {
        d.z = farZ - Math.random() * 8
        d.x = (Math.random() - 0.5) * 18
        d.y = (Math.random() - 0.5) * 11
        d.s = 0.018 + Math.random() * 0.055
        d.speed = 0.65 + Math.random() * 1.35
        changed = true
      }
      const depth = THREE.MathUtils.clamp((d.z - farZ) / (nearZ - farZ), 0, 1)
      const t = state.clock.elapsedTime
      const drift = reduced ? 0 : Math.sin(t * 0.5 + d.phase) * 0.08

      dummy.position.set(d.x + drift * depth, d.y - drift * 0.55 * depth, d.z)
      const scale = d.s * (0.45 + depth * 2.65)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      glowDummy.position.copy(dummy.position)
      glowDummy.scale.setScalar(scale * (2.8 + depth * 2.6))
      glowDummy.updateMatrix()
      glowMesh.setMatrixAt(i, glowDummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    glowMesh.instanceMatrix.needsUpdate = true
    if (changed && mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    if (changed && glowMesh.instanceColor) glowMesh.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={bloom} args={[undefined, undefined, count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <circleGeometry args={[1, 12]} />
        <meshBasicMaterial
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  )
}

export function CloudField({
  texture,
  progress,
  reduced,
}: {
  texture: THREE.Texture
  progress: MotionProps['progress']
  reduced: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const clouds = useMemo(() => {
    return Array.from({ length: 9 }, () => ({
      x: -14 + Math.random() * 28,
      y: -4.2 + Math.random() * 8.4,
      z: CAM_START - 10 - Math.random() * 30,
      speed: 0.018 + Math.random() * 0.036,
      stream: 0.22 + Math.random() * 0.46,
      phase: Math.random() * Math.PI * 2,
      layers: Array.from({ length: 7 + Math.round(Math.random() * 9) }, () => ({
        x: (Math.random() - 0.5) * 4.8,
        y: (Math.random() - 0.5) * 2.4,
        z: (Math.random() - 0.5) * 3.2,
        scale: 1.8 + Math.random() * 3.2,
        aspect: 1.65 + Math.random() * 1.4,
        angle: Math.random() * Math.PI * 2,
        spin: (0.018 + Math.random() * 0.06) * (Math.random() > 0.5 ? 1 : -1),
        opacity: 0.09 + Math.random() * 0.14,
      })),
    }))
  }, [])

  useFrame(({ clock, camera }, delta) => {
    const g = group.current
    if (!g) return
    const time = clock.elapsedTime
    const farZ = camera.position.z - 42
    const nearZ = camera.position.z + 5
    g.children.forEach((child, i) => {
      const cloud = clouds[i]
      const cluster = child as THREE.Group
      const driftSpeed = reduced ? cloud.speed * 0.28 : cloud.speed
      const streamSpeed =
        reduced ? cloud.stream * 0.2 : cloud.stream * (0.8 + progress.current * 1.4)

      cluster.position.x += delta * driftSpeed
      cluster.position.z += delta * streamSpeed
      if (cluster.position.x > 14) {
        cluster.position.x = -14 - Math.random() * 5
        cluster.position.y = -4.2 + Math.random() * 8.4
      }
      if (cluster.position.z > nearZ) {
        cluster.position.x = -14 + Math.random() * 28
        cluster.position.y = -4.2 + Math.random() * 8.4
        cluster.position.z = farZ - Math.random() * 12
      }

      cluster.position.y = cloud.y + Math.sin(time * 0.08 + cloud.phase) * 0.42
      cluster.rotation.y = Math.sin(time * 0.035 + cloud.phase) * 0.08
      const depth = THREE.MathUtils.clamp((cluster.position.z - farZ) / (nearZ - farZ), 0, 1)
      const depthFade = smoothstep(0.02, 0.24, depth) * (1 - smoothstep(0.82, 1, depth))

      cluster.children.forEach((layerChild, j) => {
        const layer = cloud.layers[j]
        const mesh = layerChild as THREE.Mesh
        const mat = mesh.material as THREE.MeshBasicMaterial
        mesh.quaternion.copy(camera.quaternion)
        mesh.rotateZ(layer.angle + time * (reduced ? layer.spin * 0.2 : layer.spin))
        mat.opacity =
          layer.opacity *
          depthFade *
          (0.82 + Math.sin(time * 0.13 + cloud.phase + j) * 0.18)
      })
    })
  })

  return (
    <group ref={group}>
      {clouds.map((cloud, i) => (
        <group key={i} position={[cloud.x, cloud.y, cloud.z]}>
          {cloud.layers.map((layer, j) => (
            <mesh
              key={j}
              position={[layer.x, layer.y, layer.z]}
              rotation={[0, 0, layer.angle]}
              scale={[layer.scale * layer.aspect, layer.scale, 1]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={layer.opacity}
                depthWrite={false}
                blending={THREE.NormalBlending}
                color={INK}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export function Rig({
  progress,
  reduced,
}: MotionProps) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const k = Math.min(1, delta * 3)
    const p = progress.current
    const t = state.clock.elapsedTime
    const autoX = Math.sin(t * 0.18) * 0.12
    const autoY = Math.cos(t * 0.15) * 0.08
    mouse.current.x += (target.current.x + autoX - mouse.current.x) * k
    mouse.current.y += (target.current.y + autoY - mouse.current.y) * k

    const z = reduced ? CAM_START - p * 2.5 : CAM_START + (CAM_END - CAM_START) * p
    camera.position.z += (z - camera.position.z) * k

    const sway = reduced ? 0.25 : 1
    const baseX = 0.6
    camera.position.x += (baseX + mouse.current.x * 0.7 * sway - camera.position.x) * k
    camera.position.y += (-mouse.current.y * 0.45 * sway - camera.position.y) * k
    camera.rotation.y += (-mouse.current.x * 0.05 - camera.rotation.y) * k
    camera.rotation.x += (mouse.current.y * 0.03 - camera.rotation.x) * k
  })

  return null
}

export function Atmosphere({
  progress,
  glow,
}: AtmosphereProps) {
  const warmMat = useRef<THREE.MeshBasicMaterial>(null)
  const warm = useRef<THREE.Group>(null)
  useFrame(({ camera }) => {
    const p = progress.current
    if (warmMat.current) warmMat.current.opacity = 0.3 + smoothstep(0.5, 1, p) * 0.55
    if (warm.current) {
      warm.current.position.z = Math.min(-13, camera.position.z - 4)
    }
  })
  return (
    <group>
      <group ref={warm}>
        <mesh position={[1, 0.3, 0]} scale={[42, 30, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            ref={warmMat}
            map={glow}
            transparent
            depthWrite={false}
            color={BLOOM_WARM}
            toneMapped={false}
          />
        </mesh>
      </group>
      <mesh position={[-6, 3, -9]} scale={[16, 14, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0.18}
          depthWrite={false}
          color={BLOOM_AMBER}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}