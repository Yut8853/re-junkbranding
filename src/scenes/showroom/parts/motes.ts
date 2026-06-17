import * as THREE from 'three';
import { makeGlowTexture } from '../textures';
import { MOTE_MAGNET_RADIUS_PX } from '../constants';
import { lerp, smoothstep } from '../utils/math';
import type { MotesFrameContext, MotesRig, Track } from '../types';

/** 粒子のカラーパレット（淡い光の 5 色）。 */
const PALETTE = [0x8fd8ff, 0xff9bd6, 0xa7ffcf, 0xb6a6ff, 0xfff0a8];

/** 粒子数。最終セクションで画面を埋めるため多めに確保する。 */
const COUNT = 320;

/** 粒子ごとに別サイズを与えるためのカスタム頂点シェーダー。 */
const VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 color;
  varying vec3 vColor;
  uniform float uSizeScale;
  uniform float uPixelRatio;
  void main() {
    vColor = color;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // 距離減衰つきのポイントサイズ。aSize で粒ごとに大きさをばらけさせる。
    gl_PointSize = aSize * uSizeScale * uPixelRatio * (300.0 / max(-mv.z, 0.001));
    gl_Position = projectionMatrix * mv;
  }
`;

/** グロー texture を乗算して加算ブレンドする断片シェーダー。 */
const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uWhiten;
  varying vec3 vColor;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    // uWhiten=1 で粒の色を白へ寄せる（最終セクション専用）。
    vec3 col = mix(vColor, vec3(1.0), uWhiten);
    gl_FragColor = vec4(col, 1.0) * tex * uOpacity;
  }
`;

/**
 * 部屋を漂う光の粒（モート）を生成する。
 *
 * 通路を中心とした円柱状の分布に配置し、粒子ごとに
 * 基準位置 / 速度 / 位相シード / サイズ / スクリーン充填アンカーを持たせる。
 * 描画は加算ブレンド + 深度無効で、専用シーン（particleScene）に入れて
 * 最前面へ重ねる。
 */
export function createMotes(track: Track): MotesRig {
  const count = COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const basePositions = new Float32Array(count * 3);
  const speeds: number[] = [];
  const seeds: number[] = [];
  // 最終セクションで画面を埋めるための、粒子ごとのスクリーン座標アンカー。
  const anchorX: number[] = [];
  const anchorY: number[] = [];
  const fillDepth: number[] = [];
  const palette = PALETTE.map((hex) => new THREE.Color(hex));

  for (let i = 0; i < count; i++) {
    // pow(rand, 0.72) で中心寄りに少し密度を持たせた円柱分布。
    const radius = Math.pow(Math.random(), 0.72);
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius * 7.5;
    const y = 0.45 + Math.random() * 4.4;
    const z = -4 - Math.random() * 26;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePositions[i * 3] = x;
    basePositions[i * 3 + 1] = y;
    basePositions[i * 3 + 2] = z;
    speeds.push(0.55 + Math.random() * 0.85);
    seeds.push(Math.random() * Math.PI * 2);

    // 粒ごとのサイズ（小さい粒を多く、大きい粒を少なく分布させる）。
    sizes[i] = 0.45 + Math.pow(Math.random(), 1.7) * 1.7;

    // スクリーン全体（-1..1）に均等に散らすアンカーと、奥行きのばらつき。
    anchorX.push(THREE.MathUtils.randFloatSpread(2));
    anchorY.push(THREE.MathUtils.randFloatSpread(2));
    fillDepth.push(7 + Math.random() * 26);

    // パレットの 2 色をランダム比率で混ぜ、色の単調さを避ける。
    const color = palette[i % palette.length].clone();
    color.lerp(palette[(i * 3 + 2) % palette.length], Math.random() * 0.42);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geo = track(new THREE.BufferGeometry());
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const glow = track(makeGlowTexture());
  const mat = track(
    new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: glow },
        uOpacity: { value: 0.94 },
        uSizeScale: { value: 1 },
        uWhiten: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false, // シーンの深度を無視して常に光として重ねる
      blending: THREE.AdditiveBlending,
    }),
  );

  const points = new THREE.Points(geo, mat);
  points.renderOrder = 40;

  return { points, basePositions, speeds, seeds, anchorX, anchorY, fillDepth };
}

// 毎フレームの new を避けるための作業用ベクトル（モジュール内で使い回す）。
const projected = new THREE.Vector3();
const magnetPoint = new THREE.Vector3();
const rayDir = new THREE.Vector3();

/**
 * 粒子の毎フレーム更新。4 つの動きを合成する:
 *
 * 1. 漂い   — 基準位置の周りを sin/cos でゆっくり揺れる。
 * 2. 集合   — 重力エフェクト中は画面中央の引力点へ渦を巻いて集まる。
 * 3. 磁石   — スクリーン座標でカーソルから MOTE_MAGNET_RADIUS_PX 以内の
 *              粒子だけがカーソルへ吸い付く。外側の粒子は影響を受けない。
 * 4. 充填   — 最終セクション（海を真上から覗く区間）では、粒子を
 *              スクリーン全体のアンカーへ移し、画面いっぱいに散らす。
 */
export function updateMotes(rig: MotesRig, ctx: MotesFrameContext): void {
  const { t, camera, px, py, gravityStretch, sparklePulse, reduced, s } = ctx;
  const halfW = window.innerWidth * 0.5;
  const halfH = window.innerHeight * 0.5;
  const attr = (rig.points.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;

  // 最終セクションで 0→1。スクリーン全面へ粒子を散らす量。
  const fill = smoothstep(0.82, 0.99, s);

  for (let i = 0; i < rig.speeds.length; i++) {
    const offset = i * 3;
    const seed = rig.seeds[i];
    const speed = rig.speeds[i];
    const drift = t * speed + seed;
    const baseX = rig.basePositions[offset];
    const baseY = rig.basePositions[offset + 1];
    const baseZ = rig.basePositions[offset + 2];

    // sparkle イベント中は粒子ごとに位相をずらしてふわっと持ち上げる。
    const sparkleLift = sparklePulse * (0.45 + 0.55 * Math.sin(seed * 3.7 + t * 5.4) * 0.5 + 0.5);
    // 集合度: 重力が強いほど 1 へ。sparkle でもわずかに寄る。
    const gather = Math.min(smoothstep(0.08, 0.82, gravityStretch) + sparkleLift * 0.1, 1);
    const swirlRadius = (1 - gather) * 0.9 + 0.42;

    // 集合時の中心（カメラ前方やや下、ポインタへ少し寄る）。
    const centerZ = camera.position.z - 3.4 - gravityStretch * 0.7;
    const centerY = camera.position.y + 0.06 + Math.sin(drift * 0.72) * 0.28 + sparkleLift * 0.18;
    const centerX = px * 0.34 + Math.cos(seed * 2.1) * 0.08;

    // 漂い位置と集合位置をそれぞれ求め、gather でブレンド。
    const idleX = baseX + Math.sin(drift * 0.62) * 0.32;
    const idleY = baseY + Math.sin(drift * 0.78) * 0.22;
    const idleZ = baseZ + Math.cos(drift * 0.38) * 0.44;
    const gatheredX = centerX + Math.cos(drift * 1.28) * swirlRadius;
    const gatheredY = centerY + Math.sin(drift * 1.08) * swirlRadius * 1.25;
    const gatheredZ = centerZ + Math.sin(seed + drift * 0.52) * 0.62;

    let x = lerp(idleX, gatheredX, gather);
    let y = lerp(idleY, gatheredY, gather);
    let z = lerp(idleZ, gatheredZ, gather);

    if (!reduced && fill < 0.92) {
      // 粒子をスクリーン座標へ投影し、カーソルとの距離（px）を測る。
      projected.set(x, y, z).project(camera);
      if (projected.z > -1 && projected.z < 1) {
        const dxPx = (projected.x - px) * halfW;
        const dyPx = (projected.y - py) * halfH;
        const distPx = Math.hypot(dxPx, dyPx);
        if (distPx < MOTE_MAGNET_RADIUS_PX) {
          // 半径の縁で 0 → カーソル上で 1。smoothstep で
          // 「縁ではやさしく、中心では強く」吸い付く磁石らしい曲線にする。
          const m = 1 - distPx / MOTE_MAGNET_RADIUS_PX;
          const stick = m * m * (3 - 2 * m);
          // この粒子の深度におけるカーソルのワールド座標を逆投影し、
          // 粒子ごとに小さな軌道を持たせて「点」ではなく「群れ」として纏わせる。
          magnetPoint.set(px, py, projected.z).unproject(camera);
          const ring = 0.16 + (1 - stick) * 0.22;
          const magnetX = magnetPoint.x + Math.cos(seed * 4.7 + drift * 1.6) * ring;
          const magnetY = magnetPoint.y + Math.sin(seed * 3.3 + drift * 1.9) * ring;
          const magnetZ = magnetPoint.z + Math.sin(seed * 2.2 + drift * 0.8) * 0.1;
          x = lerp(x, magnetX, stick);
          y = lerp(y, magnetY, stick);
          z = lerp(z, magnetZ, stick);
        }
      }
    }

    if (fill > 0.001) {
      // スクリーン上のアンカー (anchorX, anchorY) を通る視線レイ上、
      // fillDepth の距離に粒子を置く → カメラの向きに関係なく画面を埋める。
      const ax = rig.anchorX[i] + Math.sin(drift * 0.5) * 0.05;
      const ay = rig.anchorY[i] + Math.cos(drift * 0.6) * 0.05;
      rayDir.set(ax, ay, 0.5).unproject(camera).sub(camera.position).normalize();
      const depth = rig.fillDepth[i] + Math.sin(drift * 0.7) * 1.2;
      const fillX = camera.position.x + rayDir.x * depth;
      const fillY = camera.position.y + rayDir.y * depth;
      const fillZ = camera.position.z + rayDir.z * depth;
      x = lerp(x, fillX, fill);
      y = lerp(y, fillY, fill);
      z = lerp(z, fillZ, fill);
    }

    arr[offset] = x;
    arr[offset + 1] = y;
    arr[offset + 2] = z;
  }

  attr.needsUpdate = true;
  // パルスと重力に合わせて全体の輝きと粒サイズも揺らす。
  const uniforms = (rig.points.material as THREE.ShaderMaterial).uniforms;
  uniforms.uOpacity.value = Math.min(1, 0.78 + sparklePulse * 0.32 + gravityStretch * 0.22);
  uniforms.uSizeScale.value = 1 + sparklePulse * 0.5 + gravityStretch * 0.3;
  // 最終セクションでのみ粒をカラフル → 白へ寄せる（道中はカラフルのまま）。
  uniforms.uWhiten.value = fill;
}
