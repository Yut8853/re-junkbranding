import * as THREE from 'three';
import cloudVert from '../shaders/cloud.vert.glsl?raw';
import cloudFrag from '../shaders/cloud.frag.glsl?raw';
import type { CloudParams, CloudsRig, Track } from '../types';

/**
 * 地平線のすぐ上に浮かぶノイズ雲のバンドを生成する。
 *
 * 展示よりはるか奥（z = distance）に置いた横長プレーン 1 枚に
 * fbm ノイズの層雲を描き、遠くの天気がゆっくり流れているように見せる。
 * renderOrder = -1 で最初に描画し、他の要素の背景に回す。
 */
export function createClouds(params: CloudParams, track: Track): CloudsRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: cloudVert,
      fragmentShader: cloudFrag,
      transparent: true,
      depthWrite: false, // 雲同士・粒子との前後関係を壊さないよう深度は書かない
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: params.opacity },
        uFlowSpeed: { value: params.flowSpeed },
        uScaleX: { value: params.scaleX },
        uScaleY: { value: params.scaleY },
      },
    }),
  );

  const geo = track(new THREE.PlaneGeometry(420, 70));
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(0, params.height, params.distance);
  mesh.renderOrder = -1;

  return { mesh, material };
}

/** GUI の雲パラメータをユニフォームと配置へ反映する。 */
export function applyCloudParams(rig: CloudsRig, params: CloudParams): void {
  rig.material.uniforms.uOpacity.value = params.opacity;
  rig.material.uniforms.uFlowSpeed.value = params.flowSpeed;
  rig.material.uniforms.uScaleX.value = params.scaleX;
  rig.material.uniforms.uScaleY.value = params.scaleY;
  rig.mesh.position.y = params.height;
  rig.mesh.position.z = params.distance;
}
