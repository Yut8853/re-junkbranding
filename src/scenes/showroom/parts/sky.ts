import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import skyPhotoChunk from '../shaders/skyPhoto.glsl?raw';
import type { SkyParams, Track } from '../types';

/**
 * 夕暮れの空ドームを生成する。
 *
 * three.js 標準の Sky シェーダーをそのまま使うと重く濁った色になるため、
 * フラグメントシェーダーを文字列置換でパッチして
 * 「パステル調のフォト空 + 沈む太陽」(shaders/skyPhoto.glsl) に差し替える。
 * レンダラーのトーンマッピングは無効のままなので、
 * 露出調整用のユニフォーム uSkyExposure も追加している。
 */
export function createSky(exposure: number, track: Track): Sky {
  const sky = new Sky();
  sky.scale.setScalar(200);
  track(sky.geometry);
  track(sky.material);

  // 1) uniform 宣言の直後に uSkyExposure を追加
  // 2) 最終出力行をフォト空チャンクへ丸ごと置換
  sky.material.fragmentShader = sky.material.fragmentShader
    .replace('uniform vec3 sunPosition;', 'uniform vec3 sunPosition;\nuniform float uSkyExposure;')
    .replace('gl_FragColor = vec4( retColor, 1.0 );', skyPhotoChunk);
  sky.material.uniforms.uSkyExposure = { value: exposure };
  sky.material.needsUpdate = true;

  return sky;
}

/**
 * GUI のパラメータを空のユニフォームへ反映する。
 *
 * sunDir は海のマテリアル (uSunDirection) と共有している同一インスタンスなので、
 * ここで太陽位置を更新するだけで、海面の空反射と光の道も自動で追従する。
 */
export function applySkyParams(sky: Sky, params: SkyParams, sunDir: THREE.Vector3): void {
  const uniforms = sky.material.uniforms;
  uniforms.turbidity.value = params.turbidity;
  uniforms.rayleigh.value = params.rayleigh;
  uniforms.mieCoefficient.value = params.mieCoefficient;
  uniforms.mieDirectionalG.value = params.mieDirectionalG;
  uniforms.uSkyExposure.value = params.exposure;

  // 仰角・方位角（度）→ 球面座標で単位ベクトルへ変換。
  const phi = THREE.MathUtils.degToRad(90 - params.elevationDeg);
  const theta = THREE.MathUtils.degToRad(params.azimuthDeg);
  sunDir.setFromSphericalCoords(1, phi, theta);
  uniforms.sunPosition.value.copy(sunDir);
}
