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

// スクロール量（ビューポート高単位 vp）に対する感情の曲線。
// 各セクションで opacity だけでなく scale / blur / brightness / contrast を変え、
// 「世界へ近づく → 静まる → 遠のく → 沈む」を背景そのもので表現する。
function lerpStops(stops: [number, number][], vp: number) {
  if (vp <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (vp <= stops[i][0]) {
      const [v0, a] = stops[i - 1]
      const [v1, b] = stops[i]
      const t = (vp - v0) / (v1 - v0)
      return a + (b - a) * t
    }
  }
  return stops[stops.length - 1][1]
}

// Hero=世界へ近づく / Meaning=静まり言葉を受け止める / Issue=少し遠のく / Problem=深く沈む。
const OPACITY: [number, number][] = [
  [0, 1],
  [1.0, 0.85],
  [1.9, 0.62],
  [2.7, 0.4],
  [3.6, 0.2],
  [5.0, 0.12],
]
const SCALE: [number, number][] = [
  [0, 1.0],
  [1.0, 1.06], // Hero〜Meaning：寄っていく
  [1.9, 1.03], // Issue：少し引く
  [2.7, 1.0],
  [3.6, 0.98], // Problem：奥へ退く
]
const BLUR: [number, number][] = [
  [0, 0],
  [1.0, 0.4], // Meaning：わずかに霞み、言葉を前に
  [1.9, 1.4], // Issue：背景を主張させない
  [2.7, 2.6],
  [3.6, 4.2], // Problem：深く沈む
]
const BRIGHT: [number, number][] = [
  [0, 1],
  [1.0, 0.95],
  [1.9, 0.86],
  [2.7, 0.76],
  [3.6, 0.64],
]
const CONTRAST: [number, number][] = [
  [0, 1.04],
  [1.0, 1.0],
  [1.9, 0.95],
  [2.7, 0.9],
  [3.6, 0.85],
]

export function FixedWebGLBackground() {
  const progress = useRef(0)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [opacity, setOpacity] = useState(1)
  const [fx, setFx] = useState({ scale: 1, blur: 0, bright: 1, contrast: 1.04 })

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
      setOpacity(Math.max(lerpStops(OPACITY, vp), contactPresence * 0.5))
      if (reduced) {
        setFx({ scale: 1, blur: 0, bright: 1, contrast: 1 })
      } else {
        setFx({
          scale: lerpStops(SCALE, vp),
          blur: lerpStops(BLUR, vp),
          bright: lerpStops(BRIGHT, vp),
          contrast: lerpStops(CONTRAST, vp),
        })
      }
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
        className="h-full w-full transition-[transform,filter] duration-700 ease-out will-change-transform"
        style={{
          transform: `scale(${fx.scale})`,
          filter: `blur(${fx.blur}px) brightness(${fx.bright}) contrast(${fx.contrast})`,
        }}
      >
        {mounted && <HeroScene progress={progress} reduced={reduced} />}
      </div>
      {/* 左側＝コピーの安全地帯。文字裏を静かに保つための控えめなスクリム。 */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/55 md:bg-gradient-to-r md:from-background/70 md:via-background/12 md:to-transparent" />
      {/* 奥の光の余韻だけを、ごく薄く。画面全体は光らせない。 */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_64%_42%,rgba(238,242,249,0.10),transparent_46%),linear-gradient(180deg,rgba(6,7,11,0)_0%,rgba(6,7,11,0.12)_55%,rgba(6,7,11,0.5)_100%)]"
        style={{ opacity: 0.2 + fx.blur * 0.06 }}
      />
    </div>
  )
}
