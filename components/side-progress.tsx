'use client'

import { cn } from '@/lib/utils'
import { NAV_STEPS } from '@/lib/nav'
import { useScrollSpy } from '@/hooks/use-scroll-spy'
import { navClick } from '@/lib/scroll-to'

const IDS = NAV_STEPS.map((s) => s.id)

/**
 * SideProgress — a vertical "you are here" rail on the right.
 * Reflects the journey order, highlights the active step, and scrolls
 * smoothly to any section on click. Hidden on small screens.
 */
export function SideProgress() {
  const active = useScrollSpy(IDS)

  return (
    <nav
      aria-label="セクション進行"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-1">
        {NAV_STEPS.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={navClick(s.id)}
                className="group flex items-center justify-end gap-3 py-1.5"
              >
                <span
                  className={cn(
                    'text-right font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300',
                    isActive
                      ? 'text-foreground opacity-100'
                      : 'text-muted-foreground opacity-0 group-hover:opacity-70',
                  )}
                >
                  <span className="tabular-nums">{s.no}</span> {s.en}
                </span>
                <span
                  className={cn(
                    'block rounded-full transition-all duration-300',
                    isActive
                      ? 'h-2.5 w-2.5 bg-accent'
                      : 'h-1.5 w-1.5 bg-foreground/25 group-hover:bg-foreground/50',
                  )}
                />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
