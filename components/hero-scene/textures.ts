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

function bar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  roundRect(ctx, x, y, w, h, h / 2)
  ctx.fillStyle = color
  ctx.fill()
}

// Webページを構成する半透明の「ガラスの面」。見出し/本文/CTA/背景面を
// 抽象化して描く。ブラウザchromeやSaaS風UIにはしない（普通のWebページの抽象）。
export function makePanelTexture(
  kind: 'bg' | 'heading' | 'body' | 'cta',
  w: number,
  h: number,
) {
  const px = 220
  const W = Math.max(8, Math.round(w * px))
  const H = Math.max(8, Math.round(h * px))
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  const pad = Math.min(W, H) * 0.08
  const r = Math.min(W, H) * 0.06

  // ガラスの土台：ごく薄い面 + 繊細な縁。
  roundRect(ctx, 2, 2, W - 4, H - 4, r)
  ctx.fillStyle = 'rgba(255,255,255,0.035)'
  ctx.fill()
  ctx.lineWidth = Math.max(1, Math.min(W, H) * 0.006)
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.stroke()

  if (kind === 'heading') {
    bar(ctx, pad, H * 0.26, W * 0.66, H * 0.2, 'rgba(228,233,245,0.92)')
    bar(ctx, pad, H * 0.58, W * 0.42, H * 0.16, 'rgba(210,218,236,0.7)')
  } else if (kind === 'body') {
    const widths = [0.9, 0.82, 0.86, 0.58]
    widths.forEach((wf, i) => {
      bar(ctx, pad, H * (0.2 + i * 0.2), W * wf - pad * 2, H * 0.07, 'rgba(198,206,222,0.5)')
    })
  } else if (kind === 'cta') {
    const ph = H * 0.6
    roundRect(ctx, pad, H * 0.2, W - pad * 2, ph, ph / 2)
    ctx.fillStyle = 'rgba(236,241,250,0.95)'
    ctx.fill()
    bar(ctx, W * 0.34, H * 0.44, W * 0.32, H * 0.12, 'rgba(16,20,28,0.62)')
  }

  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makePhotoTexture(
  img: HTMLImageElement | null,
  ar: number,
  soft = false,
) {
  const H = 768
  const W = Math.round(H * ar)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  // 主役は「入り込む世界」なので角丸をほぼ消す。断片はもう少し丸く。
  const r = soft ? 8 : 4

  ctx.save()
  roundRect(ctx, 2, 2, W - 4, H - 4, r)
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

  if (soft) {
    // 断片：端を強く暗部へ溶かし、全体も沈めて「遠い記憶」に。
    const edge = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.14,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.56,
    )
    edge.addColorStop(0, 'rgba(6,7,11,0.18)')
    edge.addColorStop(0.55, 'rgba(6,7,11,0.5)')
    edge.addColorStop(1, 'rgba(6,7,11,1)')
    ctx.fillStyle = edge
    ctx.fillRect(0, 0, W, H)
  } else {
    // 主役：中央は鮮明に保ち、外周のわずかにだけビネット。カードの枠を感じさせない。
    const edge = ctx.createRadialGradient(
      W / 2,
      H / 2,
      Math.min(W, H) * 0.42,
      W / 2,
      H / 2,
      Math.max(W, H) * 0.7,
    )
    edge.addColorStop(0, 'rgba(6,7,11,0)')
    edge.addColorStop(0.8, 'rgba(6,7,11,0.16)')
    edge.addColorStop(1, 'rgba(6,7,11,0.62)')
    ctx.fillStyle = edge
    ctx.fillRect(0, 0, W, H)

    // 下方向のごく薄い沈み（奥行きの余韻）。
    const g = ctx.createLinearGradient(0, H * 0.6, 0, H)
    g.addColorStop(0, 'rgba(6,7,11,0)')
    g.addColorStop(1, 'rgba(6,7,11,0.34)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

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