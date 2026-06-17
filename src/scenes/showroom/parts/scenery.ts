import * as THREE from 'three';
import cloudVert from '../shaders/cloud.vert.glsl?raw';
import skyCloudsFrag from '../shaders/skyClouds.frag.glsl?raw';
import horizonFrag from '../shaders/horizon.frag.glsl?raw';
import { SKY_CLOUDS, HORIZON } from '../constants';
import type { HorizonRig, SkyCloudsRig, Track } from '../types';

/**
 * 頭上の雲（真上を向いたときに見える雲の天井）を生成する。
 *
 * カメラ上空に水平な大判プレーンを 1 枚置き、海と同じくゆっくり
 * ランダムに漂うノイズ雲を描く。renderOrder = -2 で空ドームの直後・
 * 他要素より背面に回す。
 */
export function createSkyClouds(track: Track): SkyCloudsRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: cloudVert,
      fragmentShader: skyCloudsFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: SKY_CLOUDS.opacity },
        uFlowSpeed: { value: SKY_CLOUDS.flowSpeed },
        uScale: { value: SKY_CLOUDS.scale },
        uWave: { value: 0 },
      },
    }),
  );

  const geo = track(new THREE.PlaneGeometry(SKY_CLOUDS.size, SKY_CLOUDS.size));
  const mesh = new THREE.Mesh(geo, material);
  // 水平に倒して天井にする（法線を下＝カメラ側へ向ける）。
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(0, SKY_CLOUDS.height, -30);
  mesh.renderOrder = -2;
  mesh.frustumCulled = false;

  return { mesh, material };
}

/**
 * 地平線のシルエット（山 or 町）を 1 枚生成する。
 *
 * 指定方位（azimuthDeg）の遠景に縦長プレーンを立て、その方向を
 * 向いたときだけ視界に入る稜線／スカイラインを描く。
 * mode = 0 で山並み、1 で町並み。
 */
function createHorizonSilhouette(
  cfg: { azimuthDeg: number; color: number; glow: number; opacity: number },
  mode: number,
  track: Track,
): HorizonRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: cloudVert,
      fragmentShader: horizonFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: cfg.opacity },
        uMode: { value: mode },
        uColor: { value: new THREE.Color(cfg.color) },
        uGlowColor: { value: new THREE.Color(cfg.glow) },
      },
    }),
  );

  const geo = track(new THREE.PlaneGeometry(HORIZON.width, HORIZON.height));
  const mesh = new THREE.Mesh(geo, material);

  // 方位角（度）を XZ 平面の位置へ。0 = 正面奥(-Z)、+90 = 右(+X)。
  const theta = THREE.MathUtils.degToRad(cfg.azimuthDeg);
  const x = Math.sin(theta) * HORIZON.distance;
  const z = -Math.cos(theta) * HORIZON.distance;
  mesh.position.set(x, HORIZON.baseY, z);
  // プレーンを常にシーン中心へ向ける（カメラの旋回中心 ≒ 原点付近）。
  mesh.lookAt(0, HORIZON.baseY, 0);
  mesh.renderOrder = -1;
  mesh.frustumCulled = false;

  return { mesh, material };
}

/** 右の地平線に置く山並みのシルエット。 */
export function createMountains(track: Track): HorizonRig {
  return createHorizonSilhouette(HORIZON.mountains, 0, track);
}
