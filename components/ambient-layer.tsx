'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type {
  AmbientLayerProps,
  AmbientParticlesProps,
} from '@/types/ambient-layer'

/**
 * AmbientLayer — a lightweight, GPU-cheap "afterglow" of the Hero journey.
 * Renders soft warm/cool light pools and drifting particles using only CSS
 * transforms (no extra WebGL context, no faux UI). Parallaxes gently on scroll
 * so every section feels like it lives in the same space as the Hero.
 *
 * Use sparingly: `calm` for content sections, `glow`/`deep` near the Hero
 * landing and CTA where the experience context should be strongest.
 */
export function AmbientLayer({
  variant = 'calm',
  className,
}: AmbientLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        // -1 (above viewport) .. 1 (below). 0 when centered.
        const center = rect.top + rect.height / 2
        const rel = (center - window.innerHeight / 2) / window.innerHeight
        el.style.setProperty('--p', rel.toFixed(4))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const intensity =
    variant === 'deep' ? 1 : variant === 'glow' ? 0.8 : 0.5

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
      style={{ ['--i' as string]: intensity }}
    >
      {/* warm light pool, drifts opposite to scroll */}
      <div
        className="absolute left-[12%] top-[18%] h-[60vh] w-[60vh] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--accent) 26%, transparent), transparent)',
          opacity: `calc(0.5 * var(--i))`,
          transform: 'translate3d(0, calc(var(--p, 0) * -60px), 0)',
        }}
      />
      {/* cool depth pool on the far side */}
      <div
        className="absolute right-[8%] top-[40%] h-[52vh] w-[52vh] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklch, var(--foreground) 10%, transparent), transparent)',
          opacity: `calc(0.45 * var(--i))`,
          transform: 'translate3d(0, calc(var(--p, 0) * 70px), 0)',
        }}
      />

      {/* drifting particles */}
      <Particles count={variant === 'deep' ? 18 : 10} />
    </div>
  )
}

function Particles({ count }: AmbientParticlesProps) {
  // deterministic pseudo-random positions (stable across renders, SSR-safe)
  const dots = Array.from({ length: count }, (_, i) => {
    const x = ((i * 73) % 100)
    const y = ((i * 137) % 100)
    const s = 1 + ((i * 17) % 3)
    const d = ((i % 5) - 2) * 40
    return { x, y, s, d, i }
  })
  return (
    <>
      {dots.map((p) => (
        <span
          key={p.i}
          className="absolute rounded-full bg-foreground/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            opacity: `calc(0.5 * var(--i))`,
            transform: `translate3d(0, calc(var(--p, 0) * ${p.d}px), 0)`,
          }}
        />
      ))}
    </>
  )
}
