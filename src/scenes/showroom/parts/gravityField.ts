import * as THREE from 'three';
import gravityVert from '../shaders/gravity.vert.glsl?raw';
import gravityFrag from '../shaders/gravity.frag.glsl?raw';
import type { GravityFieldRig, Track } from '../types';

/**
 * 重力フィールド（セクション遷移中に画面を満たす光の柱）を生成する。
 *
 * 加算ブレンド・深度無効の 1 枚プレーンで、updateGravityPlane() が
 * 毎フレームこれをカメラ正面（視錐台いっぱい）に貼り付ける。
 * 強度や進捗は Showroom の frame() がユニフォームで渡す。
 */
export function createGravityField(track: Track): GravityFieldRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: gravityVert,
      fragmentShader: gravityFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false, // シーンの手前に常に重ねる
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGravity: { value: 0 },     // 引力の強さ（ゲート）
        uProgress: { value: 0 },    // 遷移の進捗 0..1
        uStretchY: { value: 0 },    // 柱の縦伸び
        uDistortion: { value: 0 },  // 歪みの量
        uLightColumn: { value: 0 }, // 光の柱の明るさ
        uDirection: { value: 1 },   // スクロール方向
        uAspect: { value: 1 },      // 画面アスペクト（リサイズ時に更新）
      },
    }),
  );

  // 18×42 分割: 頂点シェーダーの縦伸び変形が滑らかに出る最低限の密度。
  const geo = track(new THREE.PlaneGeometry(1, 1, 18, 42));
  const plane = new THREE.Mesh(geo, material);
  plane.renderOrder = 20; // シーン本体より後に描く

  return { plane, material };
}

/**
 * 重力プレーンをカメラ正面 distance の位置に貼り付け、
 * その距離で視錐台をちょうど満たすサイズにスケールする。
 * カメラがどこを向いても常に画面全体を覆う。
 */
export function updateGravityPlane(
  rig: GravityFieldRig,
  camera: THREE.PerspectiveCamera,
  distance: number,
): void {
  // distance 地点での視錐台の高さと幅。
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) * 0.5) * distance;
  const width = height * camera.aspect;
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

  rig.plane.position.copy(camera.position).addScaledVector(forward, distance);
  rig.plane.quaternion.copy(camera.quaternion);
  rig.plane.scale.set(width, height, 1);
}
