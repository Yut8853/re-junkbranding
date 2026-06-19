import * as THREE from 'three';
import type { Sky } from 'three/examples/jsm/objects/Sky.js';
import { BG, GRAVITY_EFFECT, SKY, CLOUDS, CAMERA_PATH, SKY_CLOUDS } from './constants';
import type {
  CloudParams,
  CloudsRig,
  CompositePassRig,
  FloorRig,
  GravityFieldRig,
  GravityInput,
  HorizonRig,
  MotesRig,
  SkyCloudsRig,
  SkyParams,
  WaterColorParams,
  WaterParams,
} from './types';
import { clamp01, lerp, smoothstep } from './utils/math';
import { cloneWaterPreset, cloneWaterColors } from './presets/waterPreset';
import { NightSea } from './nightSea';
import { createSky, applySkyParams } from './parts/sky';
import { createClouds } from './parts/clouds';
import { createSkyClouds, createMountains } from './parts/scenery';
import { applyWaterColors, createFloor, layoutFloorForViewport } from './parts/floor';
import { createGravityField, updateGravityPlane } from './parts/gravityField';
import { createCompositePass } from './parts/compositePass';
import { createMotes, updateMotes } from './parts/motes';
import { buildExhibits, playExhibitVideo } from './parts/exhibits';
import type { ExhibitTarget } from './types';
import type { ExhibitTheme } from './textures';

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
  /** カメラ航路サンプリング用の作業ベクトル（毎フレーム再利用）。 */
  private readonly pathEye = new THREE.Vector3();
  private readonly pathLook = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  /** 空と海で共有する太陽方向ベクトル。 */
  private readonly sunDir = new THREE.Vector3(0, 0.04, -1);

  // ---- シーンパーツ（生成は parts/*、保持と毎フレーム更新はここ） ----
  private readonly sky: Sky;
  private readonly cloudsRig: CloudsRig;
  /** 頭上の雲（真上を向いたとき見える雲の天井）。 */
  private readonly skyCloudsRig: SkyCloudsRig;
  /** 右の地平線の山並み。 */
  private readonly mountainsRig: HorizonRig;
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
  /** ホバー / クリック判定に使う展示プレートの対象一覧。 */
  private readonly exhibitTargets: ExhibitTarget[];
  /** レイキャスト用。setPointer() の生値からレイを飛ばす。 */
  private readonly raycaster = new THREE.Raycaster();
  /** レイキャスト用 NDC（Three.js は上が +1 なので Y を反転して使う）。 */
  private readonly ndc = new THREE.Vector2();
  /** 現在ホバー中の展示（なければ null）。 */
  private hoveredTarget: ExhibitTarget | null = null;
  /** 各展示のホバー強度（theme をキーに 0..1 をイージングで保持）。 */
  private readonly hoverAmount = new Map<ExhibitTarget, number>();
  /** ポインタがウィンドウ内にあるか（外れたらホバー解除）。 */
  private pointerInside = false;
  /** dispose() で一括破棄するリソースの台帳。 */
  private readonly disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  // ---- 展示キューブ遷移（クリックで正立方体になり中央でクルクル回転 → モーダル） ----
  /** 遷移中のキューブ（なければ null）。 */
  private cubeMesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial> | null = null;
  /** キューブ遷移中フラグ。 */
  private cubeActive = false;
  /** モーダルを開くイベントを 1 度だけ送るためのフラグ。 */
  private cubeOpened = false;
  /** 遷移開始時刻（clock.elapsedTime）。 */
  private cubeStartTime = 0;
  /** 正立方体になったときの一辺の長さ。 */
  private cubeSide = 1;
  /** 遷移開始位置（クリックした展示プレートのワールド座標）。 */
  private readonly cubeFrom = new THREE.Vector3();
  /** 遷移開始時のスケール（プレート相当の薄い板）。 */
  private readonly cubeStartScale = new THREE.Vector3();
  /** フレーム内で使い回す作業ベクトル。 */
  private readonly tmpDir = new THREE.Vector3();
  private readonly tmpCenter = new THREE.Vector3();
  /** 遷移中の展示の識別子と遷移先 URL。 */
  private activeTheme: ExhibitTheme | null = null;
  private activeHref: string | null = null;
  /** 遷移中に非表示にしている元の展示プレート。 */
  private cubeSourceMesh: THREE.Object3D | null = null;

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
  /** CTA ボタンのホバー目標値（1 = 粒子をボタンの青へ寄せる）。 */
  private ctaTintTarget = 0;

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

    // 真上を向くと見える頭上の雲と、右の山並み。
    this.skyCloudsRig = createSkyClouds(track);
    this.scene.add(this.skyCloudsRig.mesh);
    this.mountainsRig = createMountains(track);
    this.scene.add(this.mountainsRig.mesh);

    this.floorRig = createFloor(this.waterParams, this.waterColors, this.sunDir, track);
    this.scene.add(this.floorRig.mesh);

    const exhibits = buildExhibits(this.scene, track);
    this.exhibitVideos = exhibits.videos;
    this.exhibitTargets = exhibits.targets;
    for (const target of this.exhibitTargets) this.hoverAmount.set(target, 0);

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
    this.pointerInside = true;
  }

  /** ポインタがウィンドウから外れたときに呼ぶ。ホバーを解除する。 */
  clearPointer(): void {
    this.pointerInside = false;
  }

  /**
   * 現在ホバー中の展示の遷移先 URL を返す（なければ null）。
   * ページ側��� click ハンドラから呼び、同一タブ遷移に使う。
   */
  getHoveredHref(): string | null {
    return this.hoveredTarget?.href ?? null;
  }

  /**
   * 現在ホバー中の展示をクリックしたときに呼ぶ。
   * その展示を正立方体に変えて中央へ運び、回転させてからモーダルを開く。
   * reduced 時は演出を省略してすぐモーダルを開く。ホバー対象がなければ false。
   */
  activateExhibit(): boolean {
    if (this.cubeActive) return false;
    const target = this.hoveredTarget;
    if (!target) return false;
    if (this.reduced) {
      this.dispatchExhibitOpen(target.theme, target.href);
      return true;
    }
    this.startCube(target);
    return true;
  }

  /** モーダルを開くカスタムイベントをページ側（React）へ送る。 */
  private dispatchExhibitOpen(theme: ExhibitTheme, href: string): void {
    window.dispatchEvent(
      new CustomEvent('showroom:exhibit-open', { detail: { theme, href } }),
    );
  }

  /** クリックされた展示プレートからキューブ遷移を開始する。 */
  private startCube(target: ExhibitTarget): void {
    const tex = target.material.uniforms.uMap.value as THREE.Texture;
    const { width, height } = target.mesh.geometry.parameters;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: tex,
      toneMapped: false,
      fog: false,
      transparent: true,
    });
    const cube = new THREE.Mesh(geometry, material);

    // 開始は「ほぼ平らな板」をプレート位置・サイズで配置する。
    // ※ getWorldPosition はグループを隠す前に取得する（行列が確定済み）。
    target.mesh.getWorldPosition(this.cubeFrom);
    cube.position.copy(this.cubeFrom);
    this.cubeStartScale.set(width, height, Math.min(width, height) * 0.04);
    cube.scale.copy(this.cubeStartScale);
    this.scene.add(cube);

    // 元の展示（動画プレート・四角い台座フレーム・スポットライトを含む
    // グループ全体）を遷移中だけ隠す（キューブと二重に見えないように）。
    const sourceGroup = target.mesh.parent ?? target.mesh;
    this.cubeSourceMesh = sourceGroup;
    sourceGroup.visible = false;

    // 正立方体の一辺は元プレートの短辺に合わせ、少し小さめに。
    this.cubeSide = Math.min(width, height) * 0.86;
    this.cubeMesh = cube;
    this.cubeActive = true;
    this.cubeOpened = false;
    this.cubeStartTime = this.clock.elapsedTime;
    this.activeTheme = target.theme;
    this.activeHref = target.href;
    // クリック直後はホバーカーソルを戻す。
    this.hoveredTarget = null;
    document.body.style.cursor = '';
  }

  /**
   * キューブ遷移を毎フレーム進める。
   * 1) プレート → 正立方体になりながら中央へ移動・回転（クルクル）
   * 2) 中央到達後は回転を正面で止め、16:9 の薄い板へ滑らかに変形
   * 3) 板にモーダルを重ねてフェード（クロスフェード）してから片付け
   */
  private updateCube(t: number): void {
    const cube = this.cubeMesh;
    if (!cube || !this.cubeActive) return;

    const duration = 2.6;
    const p = clamp01((t - this.cubeStartTime) / duration);

    // 移動＆立方体化は前半 0〜0.42 で完了させ、中央でしっかり立方体に。
    const formRaw = clamp01(p / 0.42);
    const form = formRaw < 0.5
      ? 4 * formRaw * formRaw * formRaw
      : 1 - Math.pow(-2 * formRaw + 2, 3) / 2; // easeInOutCubic
    // 変形(板化)は終盤 0.82〜1.0 まで待ってから一気に行う。
    const mRaw = clamp01((p - 0.82) / 0.18);
    const morph = mRaw * mRaw * (3 - 2 * mRaw); // smoothstep
    // 回転は 0〜0.82（立方体でいる間ずっと）で 3 回転し正面に収束。
    const spinP = clamp01(p / 0.82);
    const spinE = 1 - Math.pow(1 - spinP, 3); // easeOutCubic

    // カメラ前方の中央へ運ぶ。
    this.camera.getWorldDirection(this.tmpDir);
    this.tmpCenter.copy(this.camera.position).addScaledVector(this.tmpDir, 6.4);
    cube.position.lerpVectors(this.cubeFrom, this.tmpCenter, form);

    // 平らな板 → 正立方体（厚みのある cube）。
    const cubeX = lerp(this.cubeStartScale.x, this.cubeSide, form);
    const cubeY = lerp(this.cubeStartScale.y, this.cubeSide, form);
    const cubeZ = lerp(this.cubeStartScale.z, this.cubeSide, form);
    // モーダルに合わせた 16:9 の薄い板（最終形）。
    const plateW = this.cubeSide * 1.55;
    const plateH = plateW * (9 / 16);
    const plateZ = this.cubeSide * 0.015;
    cube.scale.set(
      lerp(cubeX, plateW, morph),
      lerp(cubeY, plateH, morph),
      lerp(cubeZ, plateZ, morph),
    );

    // クルクル回転（2 回転）。spinE が 1 ���正面（4π ≡ 0）に収束。
    const rotY = spinE * Math.PI * 6;
    const rotX = Math.sin(spinE * Math.PI) * 0.5; // 途中で傾き、最後は 0 に戻る
    cube.rotation.set(rotX, rotY, 0);

    // 板化が始まったらモーダルを開き、キューブをフェードアウトして受け渡す。
    if (morph > 0.4 && !this.cubeOpened) {
      this.cubeOpened = true;
      if (this.activeTheme && this.activeHref) {
        this.dispatchExhibitOpen(this.activeTheme, this.activeHref);
      }
    }
    if (this.cubeOpened) {
      const fade = clamp01((morph - 0.4) / 0.55);
      cube.material.opacity = 1 - fade;
    }

    if (p >= 1) {
      this.finishCube();
    }
  }

  /** キューブを片付けて遷移状態をリセットする。 */
  private finishCube(): void {
    if (this.cubeMesh) {
      this.scene.remove(this.cubeMesh);
      this.cubeMesh.geometry.dispose();
      this.cubeMesh.material.dispose();
      this.cubeMesh = null;
    }
    // 隠していた元の展示プレートを元に戻す。
    if (this.cubeSourceMesh) {
      this.cubeSourceMesh.visible = true;
      this.cubeSourceMesh = null;
    }
    this.cubeActive = false;
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

  /** CTA ボタンのホバー状態を受け取り、粒子の色をボタンの青へ寄せる。 */
  setCtaTint(on: boolean): void {
    this.ctaTintTarget = on ? 1 : 0;
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

  /**
   * 展示プレートへのレイキャストでホバー対象を更新し、
   * 各プレートの uHover をイージングで滑らかに駆動する。
   * reduced 時はカーソル追従を切るため常に非ホバー扱い。
   */
  private updateHover(t: number): void {
    let hit: ExhibitTarget | null = null;
    if (this.pointerInside && !this.reduced) {
      // pointerTarget は視差用に「上が -1」。Three.js の NDC は「上が +1」
      // なので Y を反転してレイを飛ばす（これがズレの主因だった）。
      this.ndc.set(this.pointerTarget.x, -this.pointerTarget.y);
      this.raycaster.setFromCamera(this.ndc, this.camera);
      let nearest = Infinity;
      for (const target of this.exhibitTargets) {
        const intersects = this.raycaster.intersectObject(target.mesh, false);
        if (intersects.length && intersects[0].distance < nearest) {
          nearest = intersects[0].distance;
          hit = target;
        }
      }
    }
    this.hoveredTarget = hit;
    // ホバー中はリンクであることを示すポインタカーソルにする。
    document.body.style.cursor = hit ? 'pointer' : '';

    // 各プレートのホバー強度を追従させ、uHover / uTime を更新する。
    for (const target of this.exhibitTargets) {
      const current = this.hoverAmount.get(target) ?? 0;
      const goal = target === hit ? 1 : 0;
      const next = current + (goal - current) * 0.18;
      this.hoverAmount.set(target, next);
      target.material.uniforms.uHover.value = next;
      target.material.uniforms.uTime.value = t;
    }
  }

  /**
   * スクロール進捗 0..1 を CAMERA_PATH 上の eye/look へ変換する。
   *
   * 進捗をキーフレーム区間に等分し、区間内は smoothstep で滑らかに
   * 補間する。これにより各セクションの境目で姿勢がカクつかず、
   * 空を見上げる→右へ振る→左へ振る→海を真上から覗く、という
   * 連続したカメラワークになる。結果は pathEye / pathLook に書き込む。
   */
  private sampleCameraPath(s: number): void {
    const segments = CAMERA_PATH.length - 1;
    const scaled = clamp01(s) * segments;
    const i = Math.min(Math.floor(scaled), segments - 1);
    const local = smoothstep(0, 1, scaled - i);
    const a = CAMERA_PATH[i];
    const b = CAMERA_PATH[i + 1];
    this.pathEye.set(
      lerp(a.eye[0], b.eye[0], local),
      lerp(a.eye[1], b.eye[1], local),
      lerp(a.eye[2], b.eye[2], local),
    );
    this.pathLook.set(
      lerp(a.look[0], b.look[0], local),
      lerp(a.look[1], b.look[1], local),
      lerp(a.look[2], b.look[2], local),
    );
  }

  /** フレームループ本体。入力のイージング → ユニフォーム更新 → 描画。 */
  private readonly frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const delta = this.clock.getDelta();
    const t = this.clock.elapsedTime;
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

    // ショールームを抜けるカメラワーク: スクロールで CAMERA_PATH をたどり、
    // 空を見上げ・左右へ振れ・最後は海を真上から覗き込む縦横��尽の動きにする。
    // 重力エフェクトはこの航路の上に「引き込み」として重ねる。
    this.sampleCameraPath(s);
    const parallax = this.waterParams.parallaxStrength;
    // 航路の eye に重力の引き込みとポインタ視差を加える。
    const targetX = this.pathEye.x + px * 1.1 * parallax;
    const targetY = this.pathEye.y + gravityStretch * GRAVITY_EFFECT.cameraLift - py * 0.5 * parallax;
    const targetZ = this.pathEye.z - gravityStretch * GRAVITY_EFFECT.cameraPull;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    // 注視点も航路の look へ追従させ、ポインタでわずかに揺らす。
    this.lookTarget.set(
      this.pathLook.x + px * 0.7,
      this.pathLook.y + py * 0.3,
      this.pathLook.z,
    );
    this.camera.lookAt(this.lookTarget);
    this.camPos.copy(this.camera.position);

    // 展示プレートのホバー判定（カメラ確定後にレイを飛ばす）。
    this.camera.updateMatrixWorld();
    this.updateHover(t);
    // クリックで開始した展示キューブの遷移を進める。
    this.updateCube(t);

    // 露出: Hero では全開、Meaning で落ち着き、Issue でさらに沈めて
    // 文字を強く読ませる。重力中はわ��かに絞り、波パルスで微かに揺れる。
    const exposure = (1 - 0.55 * smoothstep(0.3, 1, s))
      * (1 - gravityStretch * GRAVITY_EFFECT.exposureDip)
      + wavePulse * 0.09;

    // ---- 海と雲のユニフォーム更新（three.js Water.js ベース） ----
    const floorMat = this.floorRig.material;
    floorMat.uniforms.time.value += delta * this.waterParams.normalSpeed;
    floorMat.uniforms.size.value = this.waterParams.size;
    floorMat.uniforms.alpha.value = this.waterParams.alpha;
    floorMat.uniforms.distortionScale.value = this.waterParams.distortionScale
      * (1 + wavePulse * this.waterParams.wavePulseBoost);
    floorMat.uniforms.sunDirection.value.copy(this.sunDir).normalize();
    applyWaterColors(floorMat, this.waterColors, this.waterParams);
    this.cloudsRig.material.uniforms.uTime.value = t;
    // 頭上の雲: 海のうねりと連動させつつ、カメラ上空に追従させて
    // 真上を向いたとき常に視界を覆うようにする。
    this.skyCloudsRig.material.uniforms.uTime.value = t;
    this.skyCloudsRig.material.uniforms.uWave.value = wavePulse;
    this.skyCloudsRig.mesh.position.x = this.camera.position.x;
    this.skyCloudsRig.mesh.position.z = this.camera.position.z;
    this.skyCloudsRig.mesh.position.y = this.camera.position.y + SKY_CLOUDS.height;
    // 地平線の山並みの陰影を時間で揺らす。
    this.mountainsRig.material.uniforms.uTime.value = t;
    this.sky.material.uniforms.uSkyExposure.value = exposure;

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
      s,
      ctaTint: this.ctaTintTarget,
    });

    // ---- 描画: 重力中は 2 パス合成、それ以外は直接描画 ----
    const compositeStrength = this.reduced ? 0 : gravityStretch;
    if (compositeStrength > 0.01) {
      this.savedCameraPosition.copy(this.camera.position);
      this.savedCameraQuaternion.copy(this.camera.quaternion);

      // 1 枚目: カメラを下げて前へ出した「引き込まれる側」のフレーム。
      this.camera.position.y -= compositeStrength * 0.22;
      this.camera.position.z += compositeStrength * 0.86;
      this.lookTarget.set(this.pathLook.x + px * 0.58, this.pathLook.y + py * 0.22, this.pathLook.z);
      this.camera.lookAt(this.lookTarget);
      this.renderSceneTarget(this.sceneTargetA);

      // 2 枚目: カメラを上げて後ろへ引いた「残る側」のフレーム。
      this.camera.position.copy(this.savedCameraPosition);
      this.camera.quaternion.copy(this.savedCameraQuaternion);
      this.camera.position.y += compositeStrength * 0.18;
      this.camera.position.z -= compositeStrength * 0.58;
      this.lookTarget.set(this.pathLook.x + px * 0.78, this.pathLook.y + py * 0.36, this.pathLook.z);
      this.camera.lookAt(this.lookTarget);
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
    this.finishCube();
    document.body.style.cursor = '';
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
