'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { NAV_STEPS, HEADER_EXTRA } from '@/lib/nav'
import { navClick } from '@/lib/scroll-to'

const LINKS = [...NAV_STEPS, ...HEADER_EXTRA].filter(
  (s) => s.header && s.id !== 'contact',
)

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [peek, setPeek] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'theme-navy fixed inset-x-0 top-0 z-50 border-b border-transparent',
      )}
      onMouseEnter={() => setPeek(true)}
      onMouseLeave={() => setPeek(false)}
    >
      <div
        aria-hidden={!scrolled ? undefined : !peek}
        className={cn(
          'pointer-events-none absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-accent/55 transition-all duration-700',
          scrolled && !peek ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
        )}
      />
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-6 py-4 transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10',
          scrolled && !peek
            ? 'pointer-events-none -translate-y-8 scale-[0.96] opacity-0 blur-[3px]'
            : 'translate-y-0 scale-100 opacity-100 blur-0',
        )}
      >
        <a
          href="#experience"
          onClick={navClick('experience')}
          className="flex items-baseline gap-2"
        >
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
            伝わる
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Studio
          </span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={navClick(l.id)}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.ja}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={navClick('contact')}
          className={cn(
            'rounded-full border px-5 py-2 text-sm font-medium transition-[background-color,border-color,color,opacity] hover:opacity-85',
            scrolled && peek
              ? 'border-accent/45 bg-accent/10 text-foreground'
              : 'border-foreground/20 bg-foreground text-background',
          )}
        >
          相談する
        </a>
      </div>
    </header>
  )
}
