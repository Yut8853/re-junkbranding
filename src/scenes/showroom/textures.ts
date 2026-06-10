import * as THREE from 'three';

/**
 * Procedural exhibit "works".
 *
 * The showroom displays three works, each standing for a kind of value
 * JUNK BRANDING makes visible. No photography is bundled yet, so each work is
 * painted as a lit, atmospheric plate — composed (light, negative space,
 * focal point) like a gallery piece, not a stock card. Swap any `make*Texture`
 * for an image loader (`new THREE.TextureLoader().load('/works/craft.jpg')`)
 * when real photography exists; the framing in Showroom.ts stays the same.
 */

export type ExhibitTheme = 'craft' | 'space' | 'trust';

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

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

function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const vg = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.28, w / 2, h / 2, h * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Craft — 手仕事. A focused pool of warm light on a worked surface: the hands,
 * the material, the moment of making. Low, intimate, horizontal grain.
 */
function makeCraftTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#140d07';
  ctx.fillRect(0, 0, w, h);

  // A single warm spotlight low-centre — the worktable, the hands.
  const lx = w * 0.5;
  const ly = h * 0.62;
  const glow = ctx.createRadialGradient(lx, ly, 10, lx, ly, h * 0.5);
  glow.addColorStop(0, '#ffdca6');
  glow.addColorStop(0.3, '#c8843e');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Material grain — horizontal worked strokes catching the light.
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#f0c98a';
  for (let i = 0; i < 26; i++) {
    const y = ly - 70 + i * 6 + Math.random() * 3;
    ctx.lineWidth = 0.6 + Math.random();
    ctx.beginPath();
    ctx.moveTo(lx - 150 - Math.random() * 40, y);
    ctx.lineTo(lx + 150 + Math.random() * 40, y + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // The implied hands/tool — two soft warm masses meeting at the focal point.
  for (const dx of [-44, 40]) {
    const g = ctx.createRadialGradient(lx + dx, ly - 10, 0, lx + dx, ly - 10, 70);
    g.addColorStop(0, 'rgba(255,221,170,0.5)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lx + dx, ly - 10, 70, 0, Math.PI * 2);
    ctx.fill();
  }

  vignette(ctx, w, h, 0.74);
  grain(ctx, w, h, 16);
  return toTexture(canvas);
}

/**
 * Space — 空間. The air of a place: architectural depth, a soft window of
 * daylight, calm verticals and breathing negative space. Cool, tall, quiet.
 */
function makeSpaceTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#0b0f16';
  ctx.fillRect(0, 0, w, h);

  // A tall soft window of light high-left — daylight entering a room.
  const wx = w * 0.34;
  const wy = h * 0.34;
  const win = ctx.createRadialGradient(wx, wy, 8, wx, wy, h * 0.6);
  win.addColorStop(0, '#dfeaf8');
  win.addColorStop(0.34, '#7e97bd');
  win.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = win;
  ctx.fillRect(0, 0, w, h);

  // Receding floor shaft — light falling across the space (depth).
  ctx.globalAlpha = 0.5;
  const shaft = ctx.createLinearGradient(wx - 60, wy, w * 0.7, h * 0.92);
  shaft.addColorStop(0, 'rgba(223,234,248,0.5)');
  shaft.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shaft;
  ctx.beginPath();
  ctx.moveTo(wx - 80, wy + 30);
  ctx.lineTo(wx + 30, wy + 10);
  ctx.lineTo(w * 0.82, h);
  ctx.lineTo(w * 0.3, h);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // Calm verticals — the edges of the architecture, very faint.
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = '#aebfd8';
  for (const x of [w * 0.2, w * 0.52, w * 0.8]) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, h * 0.16);
    ctx.lineTo(x, h * 0.88);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  vignette(ctx, w, h, 0.66);
  grain(ctx, w, h, 14);
  return toTexture(canvas);
}

/**
 * Trust — 信頼. A single calm human presence: a soft, centred warm glow with
 * generous stillness around it. Reassurance, a person you can rely on.
 */
function makeTrustTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#100c0c';
  ctx.fillRect(0, 0, w, h);

  // Soft ambient warmth filling the whole plate — calm, safe.
  const amb = ctx.createRadialGradient(w * 0.5, h * 0.44, 30, w * 0.5, h * 0.5, h * 0.8);
  amb.addColorStop(0, 'rgba(244,222,196,0.5)');
  amb.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, w, h);

  // A single quiet presence — a soft upright glow (a figure, half-turned).
  const px = w * 0.5;
  const py = h * 0.5;
  const body = ctx.createRadialGradient(px, py, 6, px, py + 40, h * 0.34);
  body.addColorStop(0, 'rgba(255,236,210,0.62)');
  body.addColorStop(0.5, 'rgba(206,158,116,0.28)');
  body.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = body;
  // Slightly taller-than-wide to read as a presence, not a dot.
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(0.72, 1.15);
  ctx.beginPath();
  ctx.arc(0, 0, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // A soft head-light above the presence.
  const head = ctx.createRadialGradient(px, py - h * 0.16, 2, px, py - h * 0.16, 60);
  head.addColorStop(0, 'rgba(255,240,218,0.6)');
  head.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = head;
  ctx.beginPath();
  ctx.arc(px, py - h * 0.16, 60, 0, Math.PI * 2);
  ctx.fill();

  vignette(ctx, w, h, 0.72);
  grain(ctx, w, h, 14);
  return toTexture(canvas);
}

export function makeExhibitTexture(theme: ExhibitTheme): THREE.CanvasTexture {
  switch (theme) {
    case 'craft':
      return makeCraftTexture();
    case 'space':
      return makeSpaceTexture();
    case 'trust':
      return makeTrustTexture();
  }
}

/** Soft round glow used for the few dust motes drifting in the light. */
export function makeGlowTexture(): THREE.CanvasTexture {
  const s = 128;
  const { canvas, ctx } = makeCanvas(s, s);
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(canvas);
}
