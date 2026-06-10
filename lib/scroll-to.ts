'use client'

import { getLenisInstance } from '@/lib/lenis'

/**
 * Smooth-scroll to a section, used ONLY for explicit navigation (header links,
 * side rail, CTAs). Normal wheel/touch scrolling is left fully native — we
 * never call scrollIntoway during a user scroll.
 *
 * - Adds a single history entry (pushState) so Back returns to where the user
 *   clicked from.
 * - Respects prefers-reduced-motion by jumping instantly.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const headerOffset = 64
  const lenis = getLenisInstance()

  if (lenis) {
    lenis.scrollTo(el, {
      offset: -headerOffset,
      immediate: reduce,
    })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (window.location.hash !== `#${id}`) {
    history.pushState(null, '', `#${id}`)
  }
}

/** Click handler factory for anchor-style nav elements. */
export function navClick(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToSection(id)
  }
}
