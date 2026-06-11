import * as THREE from 'three';
import floorVert from '../shaders/floor.vert.glsl?raw';
import floorFrag from '../shaders/floor.frag.glsl?raw';
import type { FloorRig, Track, WaterColorParams, WaterParams } from '../types';

/** 海プレーンのワールドサイズ。layoutFloorForViewport の計算で参照する。 */
const SEA_WIDTH = 48;
const SEA_LENGTH = 120;

/**
 * 海面（floor シェーダー）を生成する。
 *
 * 頂点シェーダーが fbm のうねりで盛り上げ、
 * フラグメントシェーダーが空の反射と太陽の光の道を描く。
 * camPos / sunDir は Showroom が所有するベクトルをそのまま渡して共有し、
 * カメラ移動・太陽移動が自動でユニフォームに反映されるようにしている。
 */
export function createFloor(
  waterParams: WaterParams,
  waterColors: WaterColorParams,
  camPos: THREE.Vector3,
  sunDir: THREE.Vector3,
  track: Track,
): FloorRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: floorVert,
      fragmentShader: floorFrag,
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: 1 },
        uBase: { value: new THREE.Color(waterColors.base) },
        uShallow: { value: new THREE.Color(waterColors.shallow) },
        uCrest: { value: new THREE.Color(waterColors.crest) },
        uBrightness: { value: waterColors.brightness },
        uCamPos: { value: camPos },     // Showroom と共有（毎フレーム反映）
        uWaveStrength: { value: waterParams.waveStrength },
        uWaveScale: { value: waterParams.waveScale },
        uWaveSpeed: { value: waterParams.waveSpeed },
        uRippleStrength: { value: waterParams.rippleStrength },
        uRippleScale: { value: waterParams.rippleScale },
        uRippleSpeed: { value: waterParams.rippleSpeed },
        uFlowDirection: { value: new THREE.Vector2(waterParams.flowDirectionX, waterParams.flowDirectionY) },
        uSunDirection: { value: sunDir }, // 空と共有（太陽が動けば反射も動く）
        uCrestSoftness: { value: waterParams.crestSoftness },
        uFogStrength: { value: waterParams.fogStrength },
        uHorizonFade: { value: waterParams.horizonFade },
        uVignetteStrength: { value: waterParams.vignetteStrength },
        uDepthDarkness: { value: waterParams.depthDarkness },
        uShowGuides: { value: Number(waterParams.showGuides) },
        uShowWaterOnly: { value: Number(waterParams.showWaterOnly) },
      },
    }),
  );

  // 96×240 分割: 頂点シェーダーのうねりが滑らかに出る程度の密度。
  const geo = track(new THREE.PlaneGeometry(SEA_WIDTH, SEA_LENGTH, 96, 240));
  const mesh = new THREE.Mesh(geo, material);
  mesh.rotation.x = -Math.PI / 2; // 水平に倒す
  mesh.position.z = -28;

  return { mesh, material };
}

/**
 * 海をビューポートに合わせてレイアウトする（リサイズ時に呼ぶ）。
 *
 * 1) 水平線が画面上で約 100 CSS px 下がるように、
 *    その px 数を視野角換算して海全体を沈める。
 * 2) 最も遠い辺（地平線側）でもブラウザ幅いっぱいに見えるよう、
 *    その距離での必要幅を求めて X 方向にスケールする（+10% の余白つき）。
 */
export function layoutFloorForViewport(
  rig: FloorRig,
  camera: THREE.PerspectiveCamera,
  viewportHeight: number,
): void {
  // 海プレーンの最遠辺の Z と、カメラからの距離。
  const farEdgeZ = rig.mesh.position.z - SEA_LENGTH / 2;
  const farEdgeDistance = Math.abs(farEdgeZ - camera.position.z);

  // 100px ぶんの画角を角度に直し、その俯角に相当する高さだけ沈める。
  const dropRad = THREE.MathUtils.degToRad(camera.fov * (100 / viewportHeight));
  rig.mesh.position.y = -Math.tan(dropRad) * farEdgeDistance;

  // 最遠辺の距離で視錐台が必要とする横幅 = 2 * tan(垂直半画角) * アスペクト * 距離。
  const halfVFov = THREE.MathUtils.degToRad(camera.fov) * 0.5;
  const neededWidth = 2 * Math.tan(halfVFov) * camera.aspect * farEdgeDistance;
  rig.mesh.scale.x = Math.max(1, (neededWidth * 1.1) / SEA_WIDTH);
}

/** GUI の海流方向（X/Y）を正規化してユニフォームへ反映する。 */
export function applyWaterFlowDirection(material: THREE.ShaderMaterial, params: WaterParams): void {
  const x = params.flowDirectionX;
  const y = params.flowDirectionY;
  const length = Math.hypot(x, y) || 1; // 0 ベクトルでも割り算が壊れないように
  material.uniforms.uFlowDirection.value.set(x / length, y / length);
}

/** GUI の海の配色をユニフォームへ反映する。 */
export function applyWaterColors(material: THREE.ShaderMaterial, colors: WaterColorParams): void {
  material.uniforms.uBase.value.set(colors.base);
  material.uniforms.uShallow.value.set(colors.shallow);
  material.uniforms.uCrest.value.set(colors.crest);
  material.uniforms.uBrightness.value = colors.brightness;
}
