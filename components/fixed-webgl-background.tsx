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

function backgroundOpacity(progress: number) {
  if (progress < 0.35) return 1
  if (progress < 0.5) return mix(1, 0.94, (progress - 0.35) / 0.15)
  if (progress < 0.7) return mix(0.94, 0.78, (progress - 0.5) / 0.2)
  if (progress < 0.9) return mix(0.78, 0.38, (progress - 0.7) / 0.2)
  return 0.28
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
      const p = clamp(window.scrollY / (window.innerHeight * 2.2))
      const contact = document.getElementById('contact')
      const contactPresence = contact
        ? clamp(1 - Math.abs(contact.getBoundingClientRect().top) / window.innerHeight)
        : 0
      progress.current = reduced ? p * 0.12 : p
      setOpacity(Math.max(backgroundOpacity(p), contactPresence * 0.56))
      setVeil(clamp((p - 0.34) / 0.7))
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
          filter: `blur(${veil * 1.4}px) saturate(${1 + veil * 0.08}) brightness(${1 - veil * 0.08})`,
        }}
      >
        {mounted && <HeroScene progress={progress} reduced={reduced} />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/66 via-background/20 to-background/72 md:bg-gradient-to-r md:from-background/82 md:via-background/28 md:to-transparent" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(255,255,255,0.14),transparent_42%),radial-gradient(circle_at_52%_38%,rgba(218,228,255,0.08),transparent_38%),linear-gradient(180deg,rgba(2,3,6,0)_0%,rgba(2,3,6,0.16)_48%,rgba(2,3,6,0.56)_100%)]"
        style={{ opacity: 0.16 + veil * 0.36 }}
      />
    </div>
  )
}
