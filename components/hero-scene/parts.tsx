'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  BLOOM_INK,
  BLOOM_WARM,
  CAM_END,
  CAM_START,
  EXPLODE_END,
  EXPLODE_START,
  INK,
  PAGE_X,
  smoothstep,
} from '@/components/hero-scene/constants'
import type {
  AtmosphereProps,
  LineProps,
  MotionProps,
  PageGroupProps,
  PanelProps,
} from '@/types/hero-scene'

// 0 = 平面のWebページ / 1 = 奥行きのある体験空間へ分解。
function explodeAmount(p: number, reduced: boolean) {
  return reduced ? p * 0.28 : smoothstep(EXPLODE_START, EXPLODE_END, p)
}

// ページを構成する1つの面（写真・見出し・本文・CTA・背景面）。
// 平面状態から、スクロールに応じて奥行き方向へ静かに浮き上がる。
export function Panel({ def, texture, progress, reduced }: PanelProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state, delta) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return
    const p = progress.current
    const explode = explodeAmount(p, reduced)
    const t = state.clock.elapsedTime

    // 分解後だけ、ごく弱い浮遊感を与える（生きた空間に見せる）。
    const floatY = reduced ? 0 : Math.sin(t * 0.16 + phase) * 0.03 * explode
    const floatX = reduced ? 0 : Math.cos(t * 0.13 + phase) * 0.02 * explode

    g.position.x = def.flat[0] + def.drift[0] * explode + floatX
    g.position.y = def.flat[1] + def.drift[1] * explode + floatY
    g.position.z = def.flat[2] + def.depth * explode

    const ready = def.kind === 'photo' ? (texture ? 1 : 0) : 1
    m.opacity += (def.opacity * ready - m.opacity) * Math.min(1, delta * 4)
  })

  return (
    <group ref={group} position={def.flat}>
      <mesh scale={[def.size[0], def.size[1], 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={mat}
          map={texture ?? undefined}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// 余白・導線。平面では見えず、分解とともに細い線として現れる。
export function GuideLine({ def, progress, reduced }: LineProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame((_, delta) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return
    const explode = explodeAmount(progress.current, reduced)
    g.position.x = def.flat[0] + def.drift[0] * explode
    g.position.y = def.flat[1] + def.drift[1] * explode
    g.position.z = def.flat[2] + def.depth * explode
    m.opacity += (def.opacity * explode - m.opacity) * Math.min(1, delta * 3)
  })

  return (
    <group ref={group} position={def.flat}>
      <mesh scale={[def.size[0], def.size[1], 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={mat}
          transparent
          opacity={0}
          color={INK}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// Webページ全体のグループ。分解が進むほど、正面の平面から
// 3/4ビューへ静かに回り込み、層の奥行き（地層）が見えるようにする。
export function PageGroup({ progress, reduced, children }: PageGroupProps) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const explode = explodeAmount(progress.current, reduced)
    const t = state.clock.elapsedTime
    g.rotation.y = -0.1 - explode * 0.5
    g.rotation.x = explode * 0.06
    g.position.y = reduced ? 0 : Math.sin(t * 0.1) * 0.04
  })

  return (
    <group ref={ref} position={[PAGE_X, 0, 0]}>
      {children}
    </group>
  )
}

// 空気としての塵。見せるためではなく、奥行きを感じさせるためだけに極少量。
export function Motes({
  progress,
  glow,
  reduced,
}: MotionProps & {
  glow: THREE.Texture
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const count = 16
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; speed: number; phase: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 5,
        z: CAM_START - Math.random() * 16,
        s: 0.012 + Math.random() * 0.018,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const col = new THREE.Color()
    data.forEach((d, i) => {
      dummy.position.set(d.x, d.y, d.z)
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      col.copy(BLOOM_INK)
      mesh.setColorAt(i, col)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [data, dummy])

  useFrame((state, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const camZ = state.camera.position.z
    const farZ = camZ - 18
    const nearZ = camZ + 2
    const stream = reduced ? 0.08 : 0.25 + progress.current * 0.5
    const t = state.clock.elapsedTime
    data.forEach((d, i) => {
      d.z += delta * stream * d.speed
      if (d.z > nearZ) {
        d.z = farZ - Math.random() * 4
        d.x = (Math.random() - 0.5) * 8
        d.y = (Math.random() - 0.5) * 5
      }
      const drift = reduced ? 0 : Math.sin(t * 0.3 + d.phase) * 0.03
      dummy.position.set(d.x + drift, d.y - drift * 0.4, d.z)
      dummy.scale.setScalar(d.s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={glow}
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

// カメラ：平面を眺める位置から、分解された層の“間”へ静かに入っていく。
// 派手な飛行・スクロールジャックはしない。マウスはわずかな視差だけ。
export function Rig({ progress, reduced }: MotionProps) {
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
    const autoX = Math.sin(t * 0.12) * 0.05
    const autoY = Math.cos(t * 0.1) * 0.035
    mouse.current.x += (target.current.x + autoX - mouse.current.x) * k
    mouse.current.y += (target.current.y + autoY - mouse.current.y) * k

    const sway = reduced ? 0.2 : 1
    const z = reduced ? CAM_START - p * 0.8 : CAM_START + (CAM_END - CAM_START) * p
    camera.position.z += (z - camera.position.z) * k

    const baseX = 0.2
    camera.position.x += (baseX + mouse.current.x * 0.25 * sway - camera.position.x) * k
    camera.position.y += (-mouse.current.y * 0.16 * sway - camera.position.y) * k
    camera.rotation.y += (-mouse.current.x * 0.02 - camera.rotation.y) * k
    camera.rotation.x += (mouse.current.y * 0.015 - camera.rotation.x) * k
  })

  return null
}

// 奥の光。分解された層の背後から差し込み、空間に奥行きを与える。
// 画面全体は光らせず、「奥に光がある」と感じさせるだけ。
export function Atmosphere({ progress, glow, reduced }: AtmosphereProps) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame(() => {
    const explode = explodeAmount(progress.current, reduced)
    if (mat.current) mat.current.opacity = 0.06 + explode * 0.4
  })
  return (
    <mesh position={[PAGE_X - 0.3, 0.2, -7]} scale={[26, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        ref={mat}
        map={glow}
        transparent
        opacity={0}
        depthWrite={false}
        color={BLOOM_WARM}
        toneMapped={false}
      />
    </mesh>
  )
}
