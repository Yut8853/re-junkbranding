'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Transformation — the second climax.
 * "普通のHPが、体験に変わる瞬間。"
 *
 * A pinned stage: a flat, gray, ordinary web page (Before) visibly separates
 * into glowing, depth-layered, light-filled layers (After) as the user
 * scrolls. Pure CSS transforms (perspective + translateZ) — no extra WebGL —
 * so it stays fast and the copy stays readable.
 */
export function Transformation() {
  const ref = useRef<HTMLElement>(null)
  const [p, setP] = useState(0) // 0 = before (flat), 1 = after (experience)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), total)
      setP(total > 0 ? scrolled / total : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ease the raw scroll progress for a smoother morph
  const e = reduced ? 1 : p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
  const after = reduced ? 0.6 : e

  return (
    <section
      ref={ref}
      id="transformation"
      className={reduced ? 'theme-midnight relative z-10' : 'theme-midnight relative z-10 h-[135svh]'}
      aria-label="普通のHPが、体験に変わる瞬間"
    >
      <div
        className={
          reduced
            ? 'relative flex min-h-svh w-full flex-col overflow-hidden py-20'
            : 'sticky top-0 flex h-svh w-full flex-col overflow-hidden'
        }
      >
        {/* heading kept in its own band, away from the 3D area */}
        <div className="relative z-20 mx-auto w-full max-w-6xl px-6 pt-20 md:px-10 md:pt-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            Transformation
          </p>
          <h2 className="mt-5 max-w-xl font-serif text-[1.9rem] font-medium leading-[1.32] text-foreground text-balance md:text-5xl md:leading-[1.2]">
            写真を貼るだけではなく、
            <br />
            世界観として設計する。
          </h2>
        </div>

        {/* the morphing mock page */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6">
          <div
            className="relative w-full max-w-md"
            style={{ perspective: '1200px' }}
          >
            <MockPage after={after} />
          </div>
        </div>

        {/* before / after progress label */}
        <div className="relative z-20 mx-auto mb-12 flex w-full max-w-md items-center gap-4 px-6">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] transition-colors"
            style={{ color: after < 0.5 ? 'var(--foreground)' : 'var(--muted-foreground)' }}
          >
            Before
          </span>
          <div className="relative h-px flex-1 bg-foreground/15">
            <div
              className="absolute inset-y-0 left-0 bg-accent"
              style={{ width: `${after * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
              style={{ left: `${after * 100}%` }}
            />
          </div>
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em] transition-colors"
            style={{ color: after >= 0.5 ? 'var(--accent)' : 'var(--muted-foreground)' }}
          >
            After
          </span>
        </div>
      </div>
    </section>
  )
}

/**
 * The same web page rendered once; each layer lifts toward the viewer and
 * gains light/color as `after` goes 0 -> 1. At 0 it's a flat gray HP.
 */
function MockPage({ after }: { after: number }) {
  // shared transition feel; we drive everything off `after`
  const lift = (z: number, y: number) =>
    `translate3d(0, ${y * after}px, ${z * after}px)`

  const tiltX = after * 8 // deg
  const tiltY = after * -14

  return (
    <div
      className="relative will-change-transform"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
      }}
    >
      {/* base card */}
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          borderColor:
            after > 0.4
              ? 'color-mix(in oklch, var(--accent) 40%, transparent)'
              : 'var(--border)',
          background: 'var(--card)',
          boxShadow:
            after > 0.1
              ? `0 ${30 * after}px ${80 * after}px -20px color-mix(in oklch, oklch(0.72 0.14 55) ${40 * after}%, transparent)`
              : '0 10px 30px -20px rgba(0,0,0,0.2)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* photo / hero block — a real café photo that comes alive */}
        <div
          className="relative m-4 h-40 overflow-hidden rounded-xl"
          style={{ transform: lift(60, -6) }}
        >
          <img
            src="/jp/cafe.png"
            alt="ハンドドリップで淹れるコーヒー"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            style={{
              filter: `saturate(${0.25 + after * 0.95}) contrast(${0.92 + after * 0.18}) brightness(${0.86 + after * 0.2})`,
              transform: `scale(${1 + after * 0.06})`,
              transition: 'filter 0.3s ease',
            }}
          />
          {/* readability + warm light that grows in the After state */}
          <div
            className="absolute inset-0"
            style={{
              opacity: after,
              background:
                'radial-gradient(120% 80% at 20% 10%, rgba(255,238,205,0.55), transparent 60%)',
            }}
          />
          {/* small floating chip — lifts highest, the "interactive" cue */}
          <div
            className="absolute bottom-3 left-3 flex h-9 items-center gap-1.5 rounded-lg px-2.5"
            style={{
              transform: `translate3d(0, ${-10 * after}px, ${110 * after}px)`,
              background: after > 0.4 ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.5)',
              boxShadow:
                after > 0.2 ? '0 16px 30px -12px rgba(0,0,0,0.5)' : 'none',
              opacity: 0.4 + after * 0.6,
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: 'oklch(0.72 0.14 55)' }}
            />
            <span
              className="h-1.5 w-10 rounded"
              style={{ background: 'rgba(44,38,32,0.55)' }}
            />
          </div>
        </div>

        {/* heading line */}
        <div
          className="mx-4 mt-2 h-4 w-2/3 rounded"
          style={{
            transform: lift(40, -4),
            background:
              after > 0.4
                ? 'var(--foreground)'
                : 'oklch(0.45 0.01 80)',
          }}
        />
        {/* body lines */}
        <div className="mx-4 mt-3 space-y-2" style={{ transform: lift(24, -2) }}>
          <div className="h-2 w-full rounded bg-foreground/20" />
          <div className="h-2 w-5/6 rounded bg-foreground/15" />
          <div className="h-2 w-3/4 rounded bg-foreground/15" />
        </div>
        {/* button */}
        <div
          className="m-4 mt-5 h-10 w-32 rounded-full"
          style={{
            transform: `translate3d(0, ${-4 * after}px, ${80 * after}px)`,
            background:
              after > 0.3 ? 'var(--accent)' : 'oklch(0.5 0.01 80)',
            boxShadow:
              after > 0.3
                ? '0 14px 26px -10px color-mix(in oklch, var(--accent) 70%, transparent)'
                : 'none',
            transition: 'background 0.4s ease',
          }}
        />
      </div>

      {/* caption that swaps meaning */}
      <p
        className="mt-6 text-center text-sm leading-relaxed text-muted-foreground"
        style={{ transform: `translateZ(${40 * after}px)` }}
      >
        {after < 0.5
          ? '写真・見出し・本文・ボタンが、平面に並ぶだけ。'
          : '奥行き・光・反応が加わり、世界観そのものが伝わる。'}
      </p>
    </div>
  )
}
