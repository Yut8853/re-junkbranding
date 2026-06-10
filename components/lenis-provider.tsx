'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from '@/lib/lenis'

export function LenisProvider() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
    })

    setLenisInstance(lenis)

    let frame = 0
    const onFrame = (time: number) => {
      lenis.raf(time)
      frame = window.requestAnimationFrame(onFrame)
    }

    frame = window.requestAnimationFrame(onFrame)

    return () => {
      window.cancelAnimationFrame(frame)
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])

  return null
}