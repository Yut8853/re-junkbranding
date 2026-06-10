'use client'

import { cn } from '@/lib/utils'
import { AmbientLayer } from './ambient-layer'
import type { BridgeProps } from '@/types/bridge'

/**
 * Bridge — names the Hero experience before handing off to the "課題" section.
 * It can either stand alone or rise over the Hero as an overlay panel.
 */
export function Bridge({ id = 'meaning', progress = 1, overlay = false }: BridgeProps) {
  return (
    <section
      id={id ?? undefined}
      className={cn(
        'relative flex min-h-[88svh] items-center',
        overlay
          ? 'overflow-visible bg-transparent py-16 md:min-h-[92svh] md:py-24'
          : 'overflow-hidden bg-background',
      )}
    >
      {!overlay && <AmbientLayer variant="glow" />}
      {!overlay && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background"
        />
      )}
      {/* オーバーレイ時：背景の上に置く半透明パネル。影で途中で切れないよう全面の柔らかいスクリムにする。 */}
      {overlay && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/55 via-background/15 to-transparent"
        />
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
        <div
          className={cn('will-change-transform', overlay && 'max-w-3xl')}
          style={{
            opacity: 0.15 + progress * 0.85,
            transform: `translateY(${(1 - progress) * 32}px)`,
          }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent">
            02 — Meaning
          </p>
          <p
            className={cn(
              'mt-8 font-serif text-2xl font-medium leading-[1.6] text-foreground text-balance md:text-[2.6rem] md:leading-[1.5]',
              overlay && 'max-w-2xl text-white',
            )}
          >
            これは、
            <br className="hidden md:block" />
            ただの演出ではありません。
          </p>
          <p
            className={cn(
              'mt-10 max-w-xl text-lg leading-[2] text-muted-foreground md:text-xl md:leading-[1.9]',
              overlay && 'max-w-2xl text-white/74',
            )}
          >
            見る人の操作に反応しながら、
            <br className="hidden sm:block" />
            <span className={cn(overlay ? 'text-white' : 'text-foreground')}>
              魅力の伝わり方そのもの
            </span>
            を変える設計です。
          </p>
        </div>
      </div>
    </section>
  )
}
