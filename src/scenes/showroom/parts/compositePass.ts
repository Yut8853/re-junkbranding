import * as THREE from 'three';
import compositeVert from '../shaders/composite.vert.glsl?raw';
import compositeFrag from '../shaders/composite.frag.glsl?raw';
import type { CompositePassRig, Track } from '../types';

/**
 * 重力遷移用のフルスクリーン合成パスを生成する。
 *
 * 遷移中はシーンをカメラ位置を少しずらして 2 回レンダーターゲットへ描き
 * （sceneA / sceneB）、このパスがその 2 枚を縦ストレッチ・グリッチ・
 * 明るい RGB シフト（スクリーン合成）でブレンドして画面へ出す。
 * 遷移していないときは使われず、通常の直接描画になる。
 */
export function createCompositePass(
  sceneA: THREE.Texture,
  sceneB: THREE.Texture,
  track: Track,
): CompositePassRig {
  const material = track(
    new THREE.ShaderMaterial({
      vertexShader: compositeVert,
      fragmentShader: compositeFrag,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        tSceneA: { value: sceneA },              // ずらし描画 1 枚目
        tSceneB: { value: sceneB },              // ずらし描画 2 枚目
        uProgress: { value: 0 },                 // 遷移進捗（A→B のブレンド）
        uIntensity: { value: 0 },                // エフェクト全体の強度
        uTime: { value: 0 },
        uDirection: { value: 1 },                // スクロール方向
        uMouse: { value: new THREE.Vector2() },  // ポインタ位置（歪みの引き）
        uMouseVelocity: { value: new THREE.Vector2() }, // ポインタ速度
        uResolution: { value: new THREE.Vector2(1, 1) }, // 画面解像度
      },
    }),
  );

  // 正射影カメラ + 画面いっぱいのクアッド 1 枚だけの専用シーン。
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  scene.add(new THREE.Mesh(track(new THREE.PlaneGeometry(2, 2)), material));

  return { scene, camera, material };
}
