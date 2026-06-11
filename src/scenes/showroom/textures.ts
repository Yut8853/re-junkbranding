import * as THREE from 'three';

/**
 * プロシージャル生成の展示「作品」テクスチャ群。
 *
 * 実写画像がまだ同梱されていないため、各作品は「光・余白・焦点」を
 * ギャラリー作品のように構図した雰囲気のあるプレートとして Canvas に
 * 描いている。実写が用意できたら `make*Texture` を画像ローダー
 * (`new THREE.TextureLoader().load('/works/craft.jpg')`) に差し替えればよく、
 * Showroom 側の額装処理はそのまま使える。
 */

/** 展示テーマの識別子（サイト制作実績の動画 6 本に対応）。 */
export type ExhibitTheme = 'toPlace' | 'luzReal' | 'transB' | 'iwakiki' | 'junk' | 'next';

/** 指定サイズの作業用 Canvas と 2D コンテキストを作る。 */
function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

/** 画像全体にフィルムグレイン（粒状ノイズ）を足す。 */
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

/** 周辺減光（ビネット）を重ねて画面の縁を暗く落とす。 */
function vignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const vg = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.28, w / 2, h / 2, h * 0.78);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, `rgba(0,0,0,${strength})`);
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
}

/** Canvas を sRGB の three.js テクスチャへ変換する。 */
function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Craft — 手仕事。作業面に落ちる温かい光の渜まり:
 * 手と素材と、ものづくりの瞬間。低く親密な横方向の質感。
 */
function makeCraftTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#140d07';
  ctx.fillRect(0, 0, w, h);

  // 画面中央下寄りに温かいスポットライトを 1 灯 — 作業台と手元。
  const lx = w * 0.5;
  const ly = h * 0.62;
  const glow = ctx.createRadialGradient(lx, ly, 10, lx, ly, h * 0.5);
  glow.addColorStop(0, '#ffdca6');
  glow.addColorStop(0.3, '#c8843e');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // 素材の質感 — 光を拾う横方向の加工跡のストローク。
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

  // 手・道具の暗示 — 焦点で出会う 2 つの柔らかく温かいかたまり。
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
 * Space — 空間。場の空気: 建築的な奥行き、柔らかな昼光の窓、
 * 静かな垂直線と呆吸する余白。冷たく、高く、静謐。
 */
function makeSpaceTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#0b0f16';
  ctx.fillRect(0, 0, w, h);

  // 左上に縦長の柔らかな光の窓 — 部屋に入る昼の光。
  const wx = w * 0.34;
  const wy = h * 0.34;
  const win = ctx.createRadialGradient(wx, wy, 8, wx, wy, h * 0.6);
  win.addColorStop(0, '#dfeaf8');
  win.addColorStop(0.34, '#7e97bd');
  win.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = win;
  ctx.fillRect(0, 0, w, h);

  // 奥へ退いていく床の光の帯 — 空間を横切る光（奥行きの表現）。
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

  // 静かな垂直線 — 建築のエッジをごく淡く描く。
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
 * Trust — 信頼。静かな人の気配がひとつ: 中央の柔らかく温かい発光と、
 * その周りのたっぷりとした静けさ。安心感、頼れる存在。
 */
function makeTrustTexture(): THREE.CanvasTexture {
  const w = 640;
  const h = 800;
  const { canvas, ctx } = makeCanvas(w, h);

  ctx.fillStyle = '#100c0c';
  ctx.fillRect(0, 0, w, h);

  // プレート全体を満たす柔らかな温かみ — 穏やかで安全な空気。
  const amb = ctx.createRadialGradient(w * 0.5, h * 0.44, 30, w * 0.5, h * 0.5, h * 0.8);
  amb.addColorStop(0, 'rgba(244,222,196,0.5)');
  amb.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, w, h);

  // 静かな存在 — 柔らかく立ち上がる発光（半身を向けた人影）。
  const px = w * 0.5;
  const py = h * 0.5;
  const body = ctx.createRadialGradient(px, py, 6, px, py + 40, h * 0.34);
  body.addColorStop(0, 'rgba(255,236,210,0.62)');
  body.addColorStop(0.5, 'rgba(206,158,116,0.28)');
  body.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = body;
  // 「点」ではなく「存在」に読ませるため、縦に少し長い楕円にする。
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(0.72, 1.15);
  ctx.beginPath();
  ctx.arc(0, 0, h * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 人影の上に柔らかな頭上の光。
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

/** テーマに応じたプレースホルダーテクスチャを返す。 */
export function makeExhibitTexture(theme: ExhibitTheme): THREE.CanvasTexture {
  switch (theme) {
    case 'toPlace':
    case 'iwakiki':
      return makeCraftTexture();
    case 'luzReal':
    case 'junk':
      return makeSpaceTexture();
    case 'transB':
    case 'next':
      return makeTrustTexture();
  }
}

/** 各展示写真の配置先。実写画像はここに置く。 */
const EXHIBIT_SRC: Record<ExhibitTheme, string> = {
  toPlace: '/exhibits/to-place.webp',
  luzReal: '/exhibits/luz-real.webp',
  transB: '/exhibits/trans-b.webp',
  iwakiki: '/exhibits/iwakiki.webp',
  junk: '/exhibits/junk.webp',
  next: '/exhibits/next.webp',
};

const exhibitLoader = new THREE.TextureLoader();

/**
 * 展示の写真を「掛けられた作品」として読み込む。
 *
 * まずプロシージャルのプレースホルダーを即座に返すため、
 * ショールームが待ち状態になったり壊れたりすることはない。
 * 実写 (public/exhibits/<theme>.webp) の読み込みが完了すると onReady が
 * 発火し、エラー時（ファイル未配置）はプレースホルダーがそのまま残る。
 * 写真は sRGB + 異方性フィルタで落ち着いた色に保ち、「光る画面」ではなく
 * 「薄暗い部屋の額装プリント」として読ませる。
 */
export function loadExhibitTexture(
  theme: ExhibitTheme,
  onReady: (tex: THREE.Texture) => void,
): THREE.CanvasTexture {
  const placeholder = makeExhibitTexture(theme);
  exhibitLoader.load(
    EXHIBIT_SRC[theme],
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      onReady(tex);
    },
    undefined,
    () => {
      /* public/exhibits に写真がまだない — 描画済みのプレースホルダーを使い続ける。 */
    },
  );
  return placeholder;
}

/** 光の粒・スポットライトに使う柔らかい丸発光のテクスチャ。 */
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
