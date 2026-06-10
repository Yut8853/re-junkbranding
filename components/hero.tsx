'use client'

import { navClick } from '@/lib/scroll-to'

export function Hero() {
  return (
    <section
      id="experience"
      className="theme-navy relative z-10 flex min-h-svh items-center"
      aria-label="眺めるWebから、入り込むWebへ"
    >
      {/* コピー最優先：左側を濃いスクリムで守り、写真・粒子・光が文字裏に来ても可読性を保つ。 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/75 via-background/25 to-background/55 md:bg-gradient-to-r md:from-background/80 md:via-background/25 md:to-transparent"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl will-change-transform">
          <p className="animate-fade-up font-mono text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
            Experience-driven Web Design
          </p>
          <h1
            className="animate-fade-up mt-6 font-serif text-[2.3rem] font-medium leading-[1.28] tracking-tight text-foreground text-balance md:text-[4.4rem] md:leading-[1.12]"
            style={{ animationDelay: '80ms' }}
          >
            眺めるWebから、
            <br />
            <span className="text-accent">入り込む</span>Webへ。
          </h1>
          <p
            className="animate-fade-up mt-8 max-w-md text-base leading-loose text-muted-foreground md:text-lg"
            style={{ animationDelay: '180ms' }}
          >
            世界観まで伝わる、
            <br className="hidden sm:block" />
            体験型Webサイトを制作します。
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '280ms' }}
          >
            <a
              href="#transformation"
              onClick={navClick('transformation')}
              className="rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-85"
            >
              体験デモを見る
            </a>
            <a
              href="#contact"
              onClick={navClick('contact')}
              className="rounded-full border border-border bg-background/40 px-8 py-3.5 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary"
            >
              見積もり相談する
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center gap-3 px-6 md:px-10">
        <span className="h-px w-8 bg-foreground/30" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Scroll to enter
        </span>
      </div>
    </section>
  )
}
