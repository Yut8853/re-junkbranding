'use client'

import { useEffect, useState } from 'react'

/**
 * useScrollSpy — tracks which section id is currently active and keeps the
 * URL hash in sync (via history.replaceState so the Back button still steps
 * through sections, without hijacking scroll).
 */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    if (ids.length === 0) return

    let current = active
    const onScroll = () => {
      const mid = window.innerHeight * 0.4
      let best = current
      let bestDist = Infinity
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - mid)
        const covers = rect.top <= mid && rect.bottom >= mid
        const score = covers ? dist * 0.5 : dist
        if (score < bestDist) {
          bestDist = score
          best = id
        }
      }
      if (best !== current) {
        current = best
        setActive(best)
        const url = `#${best}`
        if (window.location.hash !== url) {
          history.replaceState(null, '', url)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')])

  return active
}
