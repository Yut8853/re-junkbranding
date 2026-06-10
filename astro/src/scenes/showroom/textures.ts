import * as THREE from 'three';

/**
 * Procedural exhibit "plate".
 *
 * No real photography is bundled yet, so each exhibit is painted as an
 * evocative, lit interior moment — a warm pool of light, soft depth, grain —
 * framed like a gallery piece. Swap `makeExhibitTexture` for an image loader
 * (`new THREE.TextureLoader().load('/exhibit-1.jpg')`) when real photos exist.
 */

type Palette = {
  base: string;
  light: string;
  accent: string;
};

const PALETTES: Record<'warm' | 'cool', Palette> = {
  warm: { base: '#1a130d', light: '#f3c88a', accent: '#c8703a' },
  cool: { base: '#0e1219', light: '#bcd2f0', accent: '#5d7ba8' },
};

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

export function makeExhibitTexture(variant: 'warm' | 'cool'): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const p = PALETTES[variant];

  // Deep base.
  ctx.fillStyle = p.base;
  ctx.fillRect(0, 0, w, h);

  // A soft directional pool of light — the subject is "lit" from upper area.
  const lx = variant === 'warm' ? w * 0.62 : w * 0.4;
  const ly = h * 0.36;
  const glow = ctx.createRadialGradient(lx, ly, 20, lx, ly, h * 0.72);
  glow.addColorStop(0, p.light);
  glow.addColorStop(0.32, p.accent);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;

  // A few soft out-of-focus highlights (bokeh) — suggests a real space.
  for (let i = 0; i < 7; i++) {
    const bx = Math.random() * w;
    const by = h * (0.2 + Math.random() * 0.7);
    const br = 18 + Math.random() * 46;
    const b = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    b.addColorStop(0, p.light);
    b.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.08 + Math.random() * 0.1;
    ctx.fillStyle = b;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Implied horizon / surface line — gives the plate spatial grounding.
  const horizon = h * 0.66;
  const hg = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 60);
  hg.addColorStop(0, 'rgba(0,0,0,0)');
  hg.addColorStop(0.5, 'rgba(0,0,0,0.28)');
  hg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = hg;
  ctx.fillRect(0, horizon - 40, w, 100);

  // Vignette to focus the eye.
  const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  grain(ctx, w, h, 16);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Soft round glow used for the few dust motes drifting in the light. */
export function makeGlowTexture(): THREE.CanvasTexture {
  const s = 128;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}
