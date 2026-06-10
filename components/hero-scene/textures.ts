import * as THREE from 'three'

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function makePhotoTexture(img: HTMLImageElement | null, ar: number) {
  const H = 768
  const W = Math.round(H * ar)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  // 角丸は弱める。カードらしさを消す。
  const r = 10

  ctx.save()
  roundRect(ctx, 4, 4, W - 8, H - 8, r)
  ctx.clip()

  if (img) {
    const ir = img.width / img.height
    const tr = W / H
    let dw = W
    let dh = H
    let dx = 0
    let dy = 0
    if (ir > tr) {
      dh = H
      dw = H * ir
      dx = (W - dw) / 2
    } else {
      dw = W
      dh = W / ir
      dy = (H - dh) / 2
    }
    ctx.drawImage(img, dx, dy, dw, dh)
  } else {
    ctx.fillStyle = '#0c0f15'
    ctx.fillRect(0, 0, W, H)
  }

  // 端を暗く溶かして「カード」ではなく空間の窓 / 記憶の断片に見せる。
  const edge = ctx.createRadialGradient(
    W / 2,
    H / 2,
    Math.min(W, H) * 0.26,
    W / 2,
    H / 2,
    Math.max(W, H) * 0.62,
  )
  edge.addColorStop(0, 'rgba(6,7,11,0)')
  edge.addColorStop(0.7, 'rgba(6,7,11,0.32)')
  edge.addColorStop(1, 'rgba(6,7,11,0.92)')
  ctx.fillStyle = edge
  ctx.fillRect(0, 0, W, H)

  // ごく薄い下方向の沈み（奥行きの余韻）。ラベル・枠は持たない。
  const g = ctx.createLinearGradient(0, H * 0.55, 0, H)
  g.addColorStop(0, 'rgba(6,7,11,0)')
  g.addColorStop(1, 'rgba(6,7,11,0.4)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  ctx.restore()

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeGlowTexture() {
  const S = 256
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return new THREE.CanvasTexture(c)
}

export function makeCloudTexture() {
  const S = 512
  const c = document.createElement('canvas')
  c.width = S
  c.height = S
  const ctx = c.getContext('2d')!

  for (let i = 0; i < 58; i++) {
    const x = S * (0.16 + Math.random() * 0.68)
    const y = S * (0.24 + Math.random() * 0.52)
    const r = S * (0.07 + Math.random() * 0.13)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${0.24 + Math.random() * 0.2})`)
    g.addColorStop(0.48, `rgba(255,255,255,${0.16 + Math.random() * 0.12})`)
    g.addColorStop(0.74, 'rgba(255,255,255,0.04)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, S, S)
  }

  ctx.globalCompositeOperation = 'destination-in'
  const mask = ctx.createRadialGradient(
    S / 2,
    S / 2,
    S * 0.12,
    S / 2,
    S / 2,
    S * 0.46,
  )
  mask.addColorStop(0, 'rgba(255,255,255,1)')
  mask.addColorStop(0.64, 'rgba(255,255,255,0.96)')
  mask.addColorStop(0.84, 'rgba(255,255,255,0.34)')
  mask.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = mask
  ctx.fillRect(0, 0, S, S)
  ctx.globalCompositeOperation = 'source-over'

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}