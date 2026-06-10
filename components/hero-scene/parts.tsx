'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
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

    // 近づくほど霧から静かに立ち上がる。近景は最初から少しだけ見えている。
    const reveal = smoothstep(13, 7.5, ahead)
    const opening =
      (1 - smoothstep(0.04, 0.3, progress.current)) * smoothstep(20, 11, ahead)
    const presence = Math.max(reveal, opening * OPENING_PHOTO_PRESENCE)

    // カメラが到達したら静かに脇へ流して通り過ぎる（派手に飛ばさない）。
    const pass = reduced ? 0 : smoothstep(2.4, -0.8, ahead)
    const passFade = smoothstep(-1.8, 1.4, ahead)
    const baseTex = texture ? 1 : 0

    m.opacity +=
      (baseTex * presence * passFade - m.opacity) * Math.min(1, delta * 3)

    const t = state.clock.elapsedTime
    const fx = reduced ? 0 : Math.cos(t * 0.24 + phase) * def.drift * 0.5
    const fy = reduced ? 0 : Math.sin(t * 0.3 + phase) * def.drift
    const approach = (1 - presence) * -0.8

    g.position.x = def.pos[0] + def.sweep[0] * pass + fx
    g.position.y = def.pos[1] + def.sweep[1] * pass + fy
    g.position.z = def.pos[2] + approach
    g.rotation.y = def.rotY - def.sweep[0] * 0.03 * pass
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
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// 奥の光源周辺に、ごく少数の塵が静かに漂うだけ（画面全体には飛ばさない）。
export function Motes({
  progress,
  glow,
  reduced,
}: MotionProps & {
  glow: THREE.Texture
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const bloom = useRef<THREE.InstancedMesh>(null)
  const count = 56
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
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 5,
        z: CAM_START - Math.random() * 28,
        s: 0.016 + Math.random() * 0.03,
        speed: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
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
      glowDummy.scale.setScalar(d.s * 2.4)
      glowDummy.updateMatrix()
      glowMesh.setMatrixAt(i, glowDummy.matrix)

      col.copy(BLOOM_INK)
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
    const farZ = camZ - 30
    const nearZ = camZ + 2.4
    const stream = reduced ? 0.2 : 0.6 + progress.current * 1.8
    data.forEach((d, i) => {
      d.z += delta * stream * d.speed
      if (d.z > nearZ) {
        d.z = farZ - Math.random() * 6
        d.x = (Math.random() - 0.5) * 8
        d.y = (Math.random() - 0.5) * 5
      }
      const depth = THREE.MathUtils.clamp((d.z - farZ) / (nearZ - farZ), 0, 1)
      const t = state.clock.elapsedTime
      const drift = reduced ? 0 : Math.sin(t * 0.4 + d.phase) * 0.05

      dummy.position.set(d.x + drift * depth, d.y - drift * 0.5 * depth, d.z)
      const scale = d.s * (0.4 + depth * 2.0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      glowDummy.position.copy(dummy.position)
      glowDummy.scale.setScalar(scale * (2.2 + depth * 2.0))
      glowDummy.updateMatrix()
      glowMesh.setMatrixAt(i, glowDummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    glowMesh.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={bloom} args={[undefined, undefined, count]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0.34}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <circleGeometry args={[1, 12]} />
        <meshBasicMaterial
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  )
}

// 霧の薄い層。奥にだけ、ごく弱く。WebGL感を出さないよう数・濃度を絞る。
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
    return Array.from({ length: 3 }, () => ({
      x: -10 + Math.random() * 20,
      y: -3 + Math.random() * 6,
      z: CAM_START - 14 - Math.random() * 22,
      speed: 0.012 + Math.random() * 0.022,
      stream: 0.14 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      layers: Array.from({ length: 5 + Math.round(Math.random() * 4) }, () => ({
        x: (Math.random() - 0.5) * 4.4,
        y: (Math.random() - 0.5) * 2.2,
        z: (Math.random() - 0.5) * 3,
        scale: 1.8 + Math.random() * 3,
        aspect: 1.6 + Math.random() * 1.3,
        angle: Math.random() * Math.PI * 2,
        spin: (0.012 + Math.random() * 0.04) * (Math.random() > 0.5 ? 1 : -1),
        opacity: 0.04 + Math.random() * 0.06,
      })),
    }))
  }, [])

  useFrame(({ clock, camera }, delta) => {
    const g = group.current
    if (!g) return
    const time = clock.elapsedTime
    const farZ = camera.position.z - 40
    const nearZ = camera.position.z + 4
    g.children.forEach((child, i) => {
      const cloud = clouds[i]
      const cluster = child as THREE.Group
      const driftSpeed = reduced ? cloud.speed * 0.28 : cloud.speed
      const streamSpeed =
        reduced ? cloud.stream * 0.2 : cloud.stream * (0.8 + progress.current * 1.1)

      cluster.position.x += delta * driftSpeed
      cluster.position.z += delta * streamSpeed
      if (cluster.position.x > 12) {
        cluster.position.x = -12 - Math.random() * 4
        cluster.position.y = -3 + Math.random() * 6
      }
      if (cluster.position.z > nearZ) {
        cluster.position.x = -10 + Math.random() * 20
        cluster.position.y = -3 + Math.random() * 6
        cluster.position.z = farZ - Math.random() * 10
      }

      cluster.position.y = cloud.y + Math.sin(time * 0.07 + cloud.phase) * 0.34
      cluster.rotation.y = Math.sin(time * 0.03 + cloud.phase) * 0.06
      const depth = THREE.MathUtils.clamp((cluster.position.z - farZ) / (nearZ - farZ), 0, 1)
      const depthFade = smoothstep(0.04, 0.26, depth) * (1 - smoothstep(0.8, 1, depth))

      cluster.children.forEach((layerChild, j) => {
        const layer = cloud.layers[j]
        const mesh = layerChild as THREE.Mesh
        const mat = mesh.material as THREE.MeshBasicMaterial
        mesh.quaternion.copy(camera.quaternion)
        mesh.rotateZ(layer.angle + time * (reduced ? layer.spin * 0.2 : layer.spin))
        mat.opacity =
          layer.opacity *
          depthFade *
          (0.82 + Math.sin(time * 0.12 + cloud.phase + j) * 0.18)
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

// カメラ：スクロールでゆっくり奥へ。マウスはほんの少しの視差だけ。
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
    const k = Math.min(1, delta * 2.2)
    const p = progress.current
    const t = state.clock.elapsedTime
    const autoX = Math.sin(t * 0.16) * 0.08
    const autoY = Math.cos(t * 0.13) * 0.05
    mouse.current.x += (target.current.x + autoX - mouse.current.x) * k
    mouse.current.y += (target.current.y + autoY - mouse.current.y) * k

    const z = reduced ? CAM_START - p * 1.5 : CAM_START + (CAM_END - CAM_START) * p
    camera.position.z += (z - camera.position.z) * k

    // 右にわずかに寄せ、左のコピー領域を常に空ける。視差は控えめ。
    const sway = reduced ? 0.2 : 1
    const baseX = 0.4
    camera.position.x += (baseX + mouse.current.x * 0.4 * sway - camera.position.x) * k
    camera.position.y += (-mouse.current.y * 0.28 * sway - camera.position.y) * k
    camera.rotation.y += (-mouse.current.x * 0.03 - camera.rotation.y) * k
    camera.rotation.x += (mouse.current.y * 0.02 - camera.rotation.x) * k
  })

  return null
}

// 奥に1点だけの光。画面全体は光らせず、奥行きの余韻として置く。
export function Atmosphere({
  progress,
  glow,
}: AtmosphereProps) {
  const warmMat = useRef<THREE.MeshBasicMaterial>(null)
  const warm = useRef<THREE.Group>(null)
  useFrame(({ camera }) => {
    const p = progress.current
    if (warmMat.current) warmMat.current.opacity = 0.2 + smoothstep(0.45, 1, p) * 0.4
    if (warm.current) {
      warm.current.position.z = Math.min(-12, camera.position.z - 5)
    }
  })
  return (
    <group ref={warm}>
      <mesh position={[0.6, 0.2, 0]} scale={[34, 24, 1]}>
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
  )
}