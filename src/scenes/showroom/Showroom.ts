import * as THREE from 'three';
import type { Sky } from 'three/examples/jsm/objects/Sky.js';

import { BG, FAR_Z, GRAVITY_EFFECT, SKY, CLOUDS } from './constants';
import type {
  CloudParams,
  CloudsRig,
  CompositePassRig,
  FloorRig,
  GravityFieldRig,
  GravityInput,
  MotesRig,
  SkyParams,
  WaterColorParams,
  WaterParams,
} from './types';
import { clamp01, lerp, smoothstep } from './utils/math';
import { cloneWaterPreset, cloneWaterColors } from './presets/waterPreset';
import { NightSea } from './nightSea';
import { createSky, applySkyParams } from './parts/sky';
import { createClouds } from './parts/clouds';
import { createFloor, layoutFloorForViewport } from './parts/floor';
import { createGravityField, updateGravityPlane } from './parts/gravityField';
import { createCompositePass } from './parts/compositePass';
import { createMotes, updateMotes } from './parts/motes';
import { buildExhibits, playExhibitVideo } from './parts/exhibits';

// ShowroomCanvas が import するため、ここから型を再エクスポートする。
export type { GravityInput } from './types';

/**
 * デジタルショールーム。
 *
 * ページ全体が 1 つの 3D ギャラリーの中に置かれる。訪問者は入口に立ち、
 * ページスクロールに連動して静かな通路を奥へ歩き、左右の壁に掛かった
 * 展示（サイト制作実績の動画）を通り過ぎていく。
 * 空間は背景ではなく主役で、Hero / Meaning / Issue の背後に居続けながら
 * 進むにつれて暗く沈んでいく。
 *
 * このクラスはオーケストレーション（生成・接続・フレームループ）だけを担う。
 * - 各シーンパーツの生成と更新 → ./parts/*
 * - シェーダー本体              → ./shaders/*
 * - 調整値・プリセット          → ./constants.ts / ./presets/*
 * - 型定義                      → ./types.ts
 */
export class Showroom {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();

  /** requestAnimationFrame の ID。0 なら停止中。 */
  private raf = 0;
  /** prefers-reduced-motion が有効か。有効なら視差・重力演出を無効化。 */
  private readonly reduced: boolean;

  /** イージング後のポインタ位置（-1..1）。 */
  private readonly pointer = new THREE.Vector2(0, 0);
  /** setPointer() で受け取る生のポインタ位置。 */
  private readonly pointerTarget = new THREE.Vector2(0, 0);
  /** setScroll() で受け取る生のスクロール進捗。 */
  private scroll = 0;
  /** イージング後のスクロール進捗。 */
  private scrollEased = 0;

  /** 海のユニフォーム uCamPos と共有するカメラ位置。 */
  private readonly camPos = new THREE.Vector3();
  /** 空と海で共有する太陽方向ベクトル。 */
  private readonly sunDir = new THREE.Vector3(0, 0.04, -1);

  // ---- シーンパーツ（生成は parts/*、保持と毎フレーム更新はここ） ----
  private readonly sky: Sky;
  private readonly cloudsRig: CloudsRig;
  private readonly floorRig: FloorRig;
  private readonly gravityRig: GravityFieldRig;
  private readonly compositeRig: CompositePassRig;
  private readonly motesRig: MotesRig;

  /** 重力遷移用のオフスクリーン描画先（2 枚をずらし描きして合成）。 */
  private readonly sceneTargetA: THREE.WebGLRenderTarget;
  private readonly sceneTargetB: THREE.WebGLRenderTarget;
  /** 粒子専用シーン。本編の後に深度をクリアして最前面へ重ねる。 */
  private readonly particleScene = new THREE.Scene();
  /** 2 回描画の間でカメラ姿勢を退避するバッファ。 */
  private readonly savedCameraPosition = new THREE.Vector3();
  private readonly savedCameraQuaternion = new THREE.Quaternion();

  /** 夜光虫イベントタイムラインの再生器。 */
  private readonly nightSea = new NightSea();
  /** 展示の動画要素。start/stop/dispose で再生制御する。 */
  private readonly exhibitVideos: HTMLVideoElement[];
  /** dispose() で一括破棄するリソースの台帳。 */
  private readonly disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  // ---- 実行時パラメータ（初期値はプリセット） ----
  private readonly skyParams: SkyParams = { ...SKY };
  private readonly cloudParams: CloudParams = { ...CLOUDS };
  private readonly waterParams: WaterParams = cloneWaterPreset();
  private readonly waterColors: WaterColorParams = cloneWaterColors();

  // ---- 重力エフェクトの状態（target を受け取り、毎フレーム緩やかに追従） ----
  private gravityTarget = 0;
  private gravity = 0;
  private gravityProgressTarget = 0;
  private gravityProgress = 0;
  private gravityDirection: 1 | -1 = 1;
  private readyDispatched = false;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.sceneTargetA = this.makeRenderTarget();
    this.sceneTargetB = this.makeRenderTarget();

    this.scene = new THREE.Scene();
    // 指数フォグ: 奥の展示ほど夕暮れの青へ溶ける。
    this.scene.fog = new THREE.FogExp2(BG, 0.026);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 240);
    this.camera.position.set(0, 1.7, 9); // 目線の高さで入口に立つ
    this.camPos.copy(this.camera.position);

    const track = this.track;

    // 空 → 雲 → 海 → 展示 → 重力フィールド → 合成パス → 粒子 の順に組み立てる。
    this.sky = createSky(this.skyParams.exposure, track);
    applySkyParams(this.sky, this.skyParams, this.sunDir);
    this.scene.add(this.sky);

    this.cloudsRig = createClouds(this.cloudParams, track);
    this.scene.add(this.cloudsRig.mesh);

    this.floorRig = createFloor(this.waterParams, this.waterColors, this.camPos, this.sunDir, track);
    this.scene.add(this.floorRig.mesh);

    this.exhibitVideos = buildExhibits(this.scene, track);

    this.gravityRig = createGravityField(track);
    this.scene.add(this.gravityRig.plane);

    this.compositeRig = createCompositePass(this.sceneTargetA.texture, this.sceneTargetB.texture, track);

    this.motesRig = createMotes(track);
    this.particleScene.add(this.motesRig.points);

    this.nightSea.load('/noctiluca_night_sea_events.json');

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  /** 破棄対象を台帳へ登録してそのまま返す。parts/* の生成関数に渡す。 */
  private readonly track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(d: T): T => {
    this.disposables.push(d);
    return d;
  };

  /** 重力遷移用レンダーターゲットを作る（サイズは resize() で設定）。 */
  private makeRenderTarget(): THREE.WebGLRenderTarget {
    return new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    });
  }

  /** 正規化ポインタ位置（-1..1）を受け取る。実際の追従は frame() のイージング。 */
  setPointer(x: number, y: number): void {
    this.pointerTarget.set(x, y);
  }

  /** ページ全体のスクロール進捗。0 = 入口、1 = ギャラリー最奥。 */
  setScroll(progress: number): void {
    this.scroll = clamp01(progress);
  }

  /** ページ側の ScrollTrigger から重力エフェクトの入力を受け取る。 */
  setGravity(input: GravityInput): void {
    this.gravityTarget = Math.min(Math.max(input.strength, 0), 1.18);
    this.gravityProgressTarget = clamp01(input.progress);
    this.gravityDirection = input.direction;
  }

  /** リサイズ: レンダラー・ターゲット・カメラ・海レイアウトを更新する。 */
  private readonly resize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.sceneTargetA.setSize(w, h);
    this.sceneTargetB.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // 海の沈み込みと横幅フィット（詳細は parts/floor.ts 参照）。
    if (this.floorRig) layoutFloorForViewport(this.floorRig, this.camera, h);
    if (this.gravityRig) this.gravityRig.material.uniforms.uAspect.value = this.camera.aspect;
    if (this.compositeRig) this.compositeRig.material.uniforms.uResolution.value.set(w, h);
  };

  /** シーン本編を指定ターゲット（null = 画面）へ 1 回描画する。 */
  private renderSceneTarget(target: THREE.WebGLRenderTarget | null): void {
    updateGravityPlane(this.gravityRig, this.camera, GRAVITY_EFFECT.planeDistance);
    this.camPos.copy(this.camera.position);
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  /** 粒子シーンを深度クリア後に重ね描きする（常に最前面の光になる）。 */
  private renderParticles(): void {
    const autoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.particleScene, this.camera);
    this.renderer.autoClear = autoClear;
  }

  /** 初回描画完了をページ側へ伝える。 */
  private dispatchReady(): void {
    if (this.readyDispatched) return;
    this.readyDispatched = true;
    window.dispatchEvent(new CustomEvent('showroom:ready'));
  }

  /** フレームループ本体。入力のイージング → ユニフォーム更新 → 描画。 */
  private readonly frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const t = this.clock.getElapsedTime();
    this.nightSea.update(t);
    const { sparklePulse, wavePulse } = this.nightSea;

    // スクロール・重力・ポインタを緩やかに追従させ、重さのある上質な動きにする。
    this.scrollEased += (this.scroll - this.scrollEased) * 0.07;
    this.gravity += (this.gravityTarget - this.gravity) * GRAVITY_EFFECT.ease;
    this.gravityProgress += (this.gravityProgressTarget - this.gravityProgress) * GRAVITY_EFFECT.progressEase;
    const ease = this.reduced ? 1 : 0.05;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease;

    const px = this.reduced ? 0 : this.pointer.x;
    const py = this.reduced ? 0 : this.pointer.y;
    const s = this.scrollEased;
    // 進捗の山なり（sin）を緩めて、遷移の中央で最も強くなる実効強度を作る。
    const gravityPeak = Math.pow(Math.sin(this.gravityProgress * Math.PI), 0.64);
    const gravityStretch = this.gravity * gravityPeak;

    // ショールームへ歩み入る: スクロールでカメラをドリーし、展示の脇を抜ける。
    const forward = this.waterParams.cameraForwardAmount;
    const targetZ = lerp(9, 9 + (-27 * forward), s) - gravityStretch * GRAVITY_EFFECT.cameraPull;
    const targetY = lerp(1.7, 1.45, s) + gravityStretch * GRAVITY_EFFECT.cameraLift;
    this.camera.position.x += (px * 1.1 * this.waterParams.parallaxStrength - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - py * 0.5 * this.waterParams.parallaxStrength - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(px * 0.7, 1.4 + py * 0.3, FAR_Z);
    this.camPos.copy(this.camera.position);

    // 露出: Hero では全開、Meaning で落ち着き、Issue でさらに沈めて
    // 文字を強く読ませる。重力中はわずかに絞り、波パルスで微かに揺れる。
    const exposure = (1 - 0.55 * smoothstep(0.3, 1, s))
      * (1 - gravityStretch * GRAVITY_EFFECT.exposureDip)
      + wavePulse * 0.09;

    // ---- 海と雲のユニフォーム更新（波パルスはうねりと波頭にも乗せる） ----
    const floorMat = this.floorRig.material;
    floorMat.uniforms.uTime.value = t;
    floorMat.uniforms.uExposure.value = exposure;
    this.cloudsRig.material.uniforms.uTime.value = t;
    floorMat.uniforms.uWaveStrength.value = this.waterParams.waveStrength * (1 + wavePulse * 1.8);
    floorMat.uniforms.uRippleStrength.value = this.waterParams.rippleStrength + wavePulse * 0.034;
    floorMat.uniforms.uCrestSoftness.value = Math.max(0.38, this.waterParams.crestSoftness - wavePulse * 0.18);

    // ---- 重力フィールドのユニフォーム更新（reduced 時はすべて 0） ----
    const gravityMat = this.gravityRig.material;
    gravityMat.uniforms.uTime.value = t;
    gravityMat.uniforms.uGravity.value = this.reduced ? 0 : this.gravity;
    gravityMat.uniforms.uProgress.value = this.gravityProgress;
    gravityMat.uniforms.uStretchY.value = this.reduced ? 0 : gravityPeak;
    gravityMat.uniforms.uDistortion.value = this.reduced ? 0 : this.gravity * (0.12 + gravityPeak * 0.88);
    gravityMat.uniforms.uLightColumn.value = this.reduced ? 0 : this.gravity;
    gravityMat.uniforms.uDirection.value = this.gravityDirection;

    // ---- 粒子の更新（漂い + 重力集合 + カーソル磁石。詳細は parts/motes.ts） ----
    this.camera.updateMatrixWorld();
    updateMotes(this.motesRig, {
      t,
      camera: this.camera,
      px,
      py,
      gravityStretch,
      sparklePulse,
      reduced: this.reduced,
    });

    // ---- 描画: 重力中は 2 パス合成、それ以外は直接描画 ----
    const compositeStrength = this.reduced ? 0 : gravityStretch;
    if (compositeStrength > 0.01) {
      this.savedCameraPosition.copy(this.camera.position);
      this.savedCameraQuaternion.copy(this.camera.quaternion);

      // 1 枚目: カメラを下げて前へ出した「引き込まれる側」のフレーム。
      this.camera.position.y -= compositeStrength * 0.22;
      this.camera.position.z += compositeStrength * 0.86;
      this.camera.lookAt(px * 0.58, 1.34 + py * 0.22, FAR_Z);
      this.renderSceneTarget(this.sceneTargetA);

      // 2 枚目: カメラを上げて後ろへ引いた「残る側」のフレーム。
      this.camera.position.copy(this.savedCameraPosition);
      this.camera.quaternion.copy(this.savedCameraQuaternion);
      this.camera.position.y += compositeStrength * 0.18;
      this.camera.position.z -= compositeStrength * 0.58;
      this.camera.lookAt(px * 0.78, 1.46 + py * 0.36, FAR_Z);
      this.renderSceneTarget(this.sceneTargetB);

      // カメラを元に戻して合成パスを画面へ。
      this.camera.position.copy(this.savedCameraPosition);
      this.camera.quaternion.copy(this.savedCameraQuaternion);
      updateGravityPlane(this.gravityRig, this.camera, GRAVITY_EFFECT.planeDistance);
      this.camPos.copy(this.camera.position);

      const compositeMat = this.compositeRig.material;
      compositeMat.uniforms.uProgress.value = this.gravityProgress;
      compositeMat.uniforms.uIntensity.value = Math.min(compositeStrength * 1.18 + wavePulse * 0.16, 1);
      compositeMat.uniforms.uTime.value = t;
      compositeMat.uniforms.uDirection.value = this.gravityDirection;
      compositeMat.uniforms.uMouse.value.set(px, py);
      // ポインタの速度（target と現在値の差）を歪みの引きに使う。
      compositeMat.uniforms.uMouseVelocity.value
        .copy(this.pointerTarget)
        .sub(this.pointer)
        .multiplyScalar(0.5);

      this.renderer.setRenderTarget(null);
      this.renderer.render(this.compositeRig.scene, this.compositeRig.camera);
      this.renderParticles();
    } else {
      this.renderSceneTarget(null);
      this.renderParticles();
    }

    this.dispatchReady();
  };

  /** ループ開始。展示動画の再生も再試行する。 */
  start(): void {
    if (this.raf) return;
    if (this.disposed) return;
    this.clock.start();
    for (const video of this.exhibitVideos) playExhibitVideo(video);
    this.frame();
  }

  /** ループ停止。動画も止めて CPU/GPU を解放する。 */
  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    for (const video of this.exhibitVideos) video.pause();
  }

  /** 全リソースの破棄。コンポーネントのアンマウント時に必ず呼ぶ。 */
  dispose(): void {
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.resize);
    for (const video of this.exhibitVideos) {
      video.removeAttribute('src');
      video.load(); // src を外した状態で load() するとバッファが解放される
    }
    for (const d of this.disposables) d.dispose();
    this.sceneTargetA.dispose();
    this.sceneTargetB.dispose();
    this.renderer.dispose();
  }
}
