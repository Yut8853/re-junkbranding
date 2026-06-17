import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';
import type { FloorRig, Track, WaterColorParams, WaterParams } from '../types';

/** 海プレーンのワールドサイズ。layoutFloorForViewport の計算で参照する。 */
const SEA_WIDTH = 96;
const SEA_LENGTH = 240;

/**
 * 海面（three.js Water.js）を生成する。
 */
export function createFloor(
  waterParams: WaterParams,
  waterColors: WaterColorParams,
  sunDir: THREE.Vector3,
  track: Track,
): FloorRig {
  const geo = track(new THREE.PlaneGeometry(SEA_WIDTH, SEA_LENGTH, 1, 1));
  const waterNormals = track(new THREE.TextureLoader().load('/inorganic/waternormals.jpg'));
  waterNormals.wrapS = THREE.RepeatWrapping;
  waterNormals.wrapT = THREE.RepeatWrapping;

  const mesh = new Water(geo, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection: sunDir.clone().normalize(),
    sunColor: new THREE.Color(waterColors.sun),
    waterColor: new THREE.Color(waterColors.water),
    distortionScale: waterParams.distortionScale,
    fog: false,
  });
  const material = mesh.material as THREE.ShaderMaterial;
  material.uniforms.alpha.value = waterParams.alpha;
  material.uniforms.size.value = waterParams.size;

  mesh.rotation.x = -Math.PI / 2; // 水平に倒す
  mesh.position.z = -28;

  track(material);
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

/** GUI の海の配色をユニフォームへ反映する。 */
export function applyWaterColors(
  material: THREE.ShaderMaterial,
  colors: WaterColorParams,
  params: WaterParams,
): void {
  material.uniforms.waterColor.value.set(colors.water);
  material.uniforms.sunColor.value.set(colors.sun).multiplyScalar(params.sunColorIntensity);
}
