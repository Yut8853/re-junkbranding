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