'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const HeroScene = dynamic(
  () => import('./hero-scene').then((m) => m.HeroScene),
  { ssr: false },
)

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function mix(from: number, to: number, amount: number) {
  return from + (to - from) * clamp(amount)
}

// 背景の強度を、スクロール量（ビューポート高単位 vp）に対して滑らかに落とす。
// Hero=100% → Bridge/Issue/Problem まで余韻を残し、Transformation以降で静かに引く。
const STOPS: [number, number][] = [
  [0, 1],      // Hero
  [1.0, 0.82], // Bridge / 02 Meaning
  [1.9, 0.6],  // Issue / 03
  [2.7, 0.4],  // Problem
  [3.6, 0.2],  // Transformation以降
  [5.0, 0.12],
]

function backgroundIntensity(vp: number) {
  if (vp <= STOPS[0][0]) return STOPS[0][1]
  for (let i = 1; i < STOPS.length; i++) {
    if (vp <= STOPS[i][0]) {
      const [v0, o0] = STOPS[i - 1]
      const [v1, o1] = STOPS[i]
      return mix(o0, o1, (vp - v0) / (v1 - v0))
    }
  }
  return STOPS[STOPS.length - 1][1]
}

export function FixedWebGLBackground() {
  const progress = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [veil, setVeil] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const vp = window.scrollY / window.innerHeight
      // 3Dジャーニーは Hero〜Issue 付近で 0→1。急がず、スクロールに自然同期。
      const p = clamp(vp / 2.4)
      const contact = document.getElementById('contact')
      const contactPresence = contact
        ? clamp(1 - Math.abs(contact.getBoundingClientRect().top) / window.innerHeight)
        : 0
      progress.current = reduced ? p * 0.12 : p
      setOpacity(Math.max(backgroundIntensity(vp), contactPresence * 0.5))
      setVeil(clamp((vp - 0.8) / 2.4))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <div
      aria-hidden
      className="theme-navy pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
      style={{ opacity }}
    >
      <div
        className="h-full w-full transition-[filter] duration-500 ease-out"
        style={{
          filter: `blur(${veil * 1.1}px) brightness(${1 - veil * 0.06})`,
        }}
      >
        {mounted && <HeroScene progress={progress} reduced={reduced} />}
      </div>
      {/* 左側＝コピーの安全地帯。文字裏を静かに保つための控えめなスクリム。 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/55 md:bg-gradient-to-r md:from-background/70 md:via-background/12 md:to-transparent" />
      {/* 奥の光の余韻だけを、ごく薄く。画面全体は光らせない。 */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,rgba(238,242,249,0.10),transparent_46%),linear-gradient(180deg,rgba(6,7,11,0)_0%,rgba(6,7,11,0.12)_55%,rgba(6,7,11,0.5)_100%)]"
        style={{ opacity: 0.2 + veil * 0.3 }}
      />
    </div>
  )
}
