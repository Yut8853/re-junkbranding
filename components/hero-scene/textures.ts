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

export function makePhotoTexture(
  img: HTMLImageElement | null,
  label: string,
  ar: number,
) {
  const H = 768
  const W = Math.round(H * ar)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const r = 26

  ctx.save()
  roundRect(ctx, 6, 6, W - 12, H - 12, r)
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
    ctx.fillStyle = '#1c2233'
    ctx.fillRect(0, 0, W, H)
  }

  const g = ctx.createLinearGradient(0, H * 0.5, 0, H)
  g.addColorStop(0, 'rgba(12,15,24,0)')
  g.addColorStop(1, 'rgba(12,15,24,0.62)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  ctx.fillStyle = '#e6b066'
  ctx.fillRect(40, H - 86, 34, 3)
  ctx.fillStyle = 'rgba(247,243,236,0.92)'
  ctx.font = '500 30px ui-sans-serif, system-ui, sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(label, 40, H - 50)

  ctx.restore()

  roundRect(ctx, 6, 6, W - 12, H - 12, r)
  ctx.strokeStyle = 'rgba(243,221,180,0.16)'
  ctx.lineWidth = 2
  ctx.stroke()

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