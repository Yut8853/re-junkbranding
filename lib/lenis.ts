'use client'

import type Lenis from 'lenis'

let lenisInstance: Lenis | null = null

export function setLenisInstance(lenis: Lenis | null) {
  lenisInstance = lenis
}

export function getLenisInstance() {
  return lenisInstance
}