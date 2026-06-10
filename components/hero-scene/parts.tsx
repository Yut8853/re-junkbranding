'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  BLOOM_INK,
  BLOOM_WARM,
  CAM_END,
  CAM_START,
  ENTER_END,
  ENTER_START,
  INK,
  smoothstep,
} from '@/components/hero-scene/constants'
import type {
  AtmosphereProps,
  MotionProps,
  PhotoLayerProps,
} from '@/types/hero-scene'

// 主役＝入り込む1枚の世界。断片＝奥に薄く漂う他業種の気配。
export function PhotoLayer({
  def,
  texture,
  progress,
  reduced,
}: PhotoLayerProps) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame((state, delta) => {
    const g = group.current
    const m = mat.current
    if (!g || !m) return
    const p = progress.current
    const t = state.clock.elapsedTime
    const baseTex = texture ? 1 : 0
    const k = Math.min(1, delta * 4)

    if (def.role === 'main') {
      // 最初から世界が見えている → 近づく → 一度だけ中を通り抜けて画面外へ。
      const intro = smoothstep(0, 0.04, p)
      const approach = smoothstep(0, ENTER_START, p)
      const enter = reduced ? 0 : smoothstep(ENTER_START, ENTER_END, p)
      const pass = 1 - smoothstep(0.5, 1, enter)

      const target = baseTex * intro * pass
      m.opacity += (target - m.opacity) * k

      const float = reduced ? 0 : Math.sin(t * 0.14 + phase) * 0.05
      g.position.x = def.pos[0] + enter * 2.2
      g.position.y = def.pos[1] + enter * 0.8 + float
      g.position.z = def.pos[2] + approach * 0.5 + enter * 4.4
      g.rotation.y = def.rotY - enter * 0.14
      g.rotation.x = def.rotX
      g.scale.setScalar(1 + approach * 0.1 + enter * 1.6)
    } else {
      // 断片：薄く立ち上がり、Meaning に向けて静かに消えていく。
      const appear = smoothstep(0.02, 0.16, p)
      const fade = 1 - smoothstep(0.32, 0.66, p)
      const target = baseTex * def.maxOpacity * appear * fade
      m.opacity += (target - m.opacity) * Math.min(1, delta * 3)

      const float = reduced ? 0 : Math.sin(t * 0.1 + phase) * 0.05
      g.position.x = def.pos[0]
      g.position.y = def.pos[1] + float
      g.position.z = def.pos[2] - p * 1.6
    }
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

// 空気としての塵。見せるためではなく、奥行きを感じさせるためだけに、ごく薄く。
export function Motes({
  progress,
  glow,
  reduced,
}: MotionProps & {
  glow: THREE.Texture
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const bloom = useRef<THREE.InstancedMesh>(null)
  const count = 30
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
        x: (Math.random() - 0.5) * 9,
        y: (Math.random() - 0.5) * 5.5,
        z: CAM_START - Math.random() * 30,
        s: 0.014 + Math.random() * 0.024,
        speed: 0.4 + Math.random() * 0.7,
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
      glowDummy.scale.setScalar(d.s * 2.2)
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
    const farZ = camZ - 32
    const nearZ = camZ + 2
    const stream = reduced ? 0.12 : 0.4 + progress.current * 1.0
    data.forEach((d, i) => {
      d.z += delta * stream * d.speed
      if (d.z > nearZ) {
        d.z = farZ - Math.random() * 6
        d.x = (Math.random() - 0.5) * 9
        d.y = (Math.random() - 0.5) * 5.5
      }
      const depth = THREE.MathUtils.clamp((d.z - farZ) / (nearZ - farZ), 0, 1)
      const t = state.clock.elapsedTime
      const drift = reduced ? 0 : Math.sin(t * 0.32 + d.phase) * 0.04

      dummy.position.set(d.x + drift * depth, d.y - drift * 0.5 * depth, d.z)
      const scale = d.s * (0.4 + depth * 1.6)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      glowDummy.position.copy(dummy.position)
      glowDummy.scale.setScalar(scale * (1.8 + depth * 1.6))
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
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <circleGeometry args={[1, 12]} />
        <meshBasicMaterial
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </instancedMesh>
    </>
  )
}

// 霧は奥だけ、ごく弱く。空気の層として感じる程度に。
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
      z: CAM_START - 16 - Math.random() * 22,
      speed: 0.01 + Math.random() * 0.018,
      stream: 0.12 + Math.random() * 0.24,
      phase: Math.random() * Math.PI * 2,
      layers: Array.from({ length: 5 + Math.round(Math.random() * 3) }, () => ({
        x: (Math.random() - 0.5) * 4.4,
        y: (Math.random() - 0.5) * 2.2,
        z: (Math.random() - 0.5) * 3,
        scale: 2 + Math.random() * 3,
        aspect: 1.6 + Math.random() * 1.3,
        angle: Math.random() * Math.PI * 2,
        spin: (0.008 + Math.random() * 0.03) * (Math.random() > 0.5 ? 1 : -1),
        opacity: 0.03 + Math.random() * 0.035,
      })),
    }))
  }, [])

  useFrame(({ clock, camera }, delta) => {
    const g = group.current
    if (!g) return
    const time = clock.elapsedTime
    const farZ = camera.position.z - 42
    const nearZ = camera.position.z + 4
    g.children.forEach((child, i) => {
      const cloud = clouds[i]
      const cluster = child as THREE.Group
      const driftSpeed = reduced ? cloud.speed * 0.28 : cloud.speed
      const streamSpeed =
        reduced ? cloud.stream * 0.2 : cloud.stream * (0.8 + progress.current * 0.9)

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

      cluster.position.y = cloud.y + Math.sin(time * 0.06 + cloud.phase) * 0.3
      cluster.rotation.y = Math.sin(time * 0.025 + cloud.phase) * 0.05
      const depth = THREE.MathUtils.clamp((cluster.position.z - farZ) / (nearZ - farZ), 0, 1)
      const depthFade = smoothstep(0.04, 0.26, depth) * (1 - smoothstep(0.78, 1, depth))

      cluster.children.forEach((layerChild, j) => {
        const layer = cloud.layers[j]
        const mesh = layerChild as THREE.Mesh
        const mat = mesh.material as THREE.MeshBasicMaterial
        mesh.quaternion.copy(camera.quaternion)
        mesh.rotateZ(layer.angle + time * (reduced ? layer.spin * 0.2 : layer.spin))
        mat.opacity =
          layer.opacity *
          depthFade *
          (0.84 + Math.sin(time * 0.1 + cloud.phase + j) * 0.16)
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

// カメラ：スクロールでゆっくり奥へ。写真の中を一度だけ通り抜ける旅程を支える。
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
    const enter = smoothstep(ENTER_START, ENTER_END, p)
    const autoX = Math.sin(t * 0.14) * 0.06
    const autoY = Math.cos(t * 0.12) * 0.04
    mouse.current.x += (target.current.x + autoX - mouse.current.x) * k
    mouse.current.y += (target.current.y + autoY - mouse.current.y) * k

    const z = reduced ? CAM_START - p * 1.2 : CAM_START + (CAM_END - CAM_START) * p
    camera.position.z += (z - camera.position.z) * k

    // 通り抜ける瞬間だけ、わずかに主役側へ寄る（入り込む手応え）。
    const baseX = 0.3 + enter * 0.5
    const sway = reduced ? 0.2 : 1
    camera.position.x += (baseX + mouse.current.x * 0.32 * sway - camera.position.x) * k
    camera.position.y += (-mouse.current.y * 0.22 * sway - camera.position.y) * k
    camera.rotation.y += (-mouse.current.x * 0.025 - camera.rotation.y) * k
    camera.rotation.x += (mouse.current.y * 0.018 - camera.rotation.x) * k
  })

  return null
}

// 奥の光。写真の中を通り抜けた瞬間に立ち上がり、Meaning の静けさを照らす。
export function Atmosphere({
  progress,
  glow,
}: AtmosphereProps) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const grp = useRef<THREE.Group>(null)
  useFrame(({ camera }) => {
    const p = progress.current
    const enter = smoothstep(ENTER_START, ENTER_END, p)
    const settle = 1 - smoothstep(0.62, 0.95, p)
    if (mat.current) {
      mat.current.opacity = (0.1 + enter * 0.46) * (0.5 + settle * 0.5)
    }
    if (grp.current) {
      grp.current.position.z = Math.min(-10, camera.position.z - 6)
    }
  })
  return (
    <group ref={grp}>
      <mesh position={[0.5, 0.1, 0]} scale={[30, 22, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          ref={mat}
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