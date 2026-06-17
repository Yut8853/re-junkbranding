import type * as THREE from 'three';
import { WATER_PRESET } from './presets/waterPreset';
import { SKY, CLOUDS } from './constants';
import type { ExhibitTheme } from './textures';

/* ============================================================
 * Showroom 全体で使う型定義の集約ファイル。
 * 値（プリセット・定数）は constants.ts / presets/ に置き、
 * ここには「型」だけをまとめる。
 * ============================================================ */

/**
 * 破棄対象（ジオメトリ / マテリアル / テクスチャ）を登録しつつ
 * そのまま返すヘルパー関数の型。
 * Showroom#dispose() で一括 dispose するために使う。
 */
export type Track = <T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(d: T) => T;

/** 海のプリセット値オブジェクト（presets/waterPreset.ts の WATER_PRESET）の型。 */
export type WaterPreset = typeof WATER_PRESET;

/**
 * 海の実行時パラメータ。
 * プリセットの readonly を外し、GUI から書き換えられるようにしたもの。
 */
export type WaterParams = {
  -readonly [K in keyof WaterPreset]: WaterPreset[K] extends boolean ? boolean : number;
};

/** 海の配色パラメータ（GUI のカラーピッカーで編集する）。 */
export type WaterColorParams = {
  /** 最も深い水の色。 */
  base: string;
  /** 光を受けた浅い水の色。 */
  shallow: string;
  /** 波頭のハイライト色。 */
  crest: string;
  /** 海全体の明るさ係数。 */
  brightness: number;
};

/** 空（three.js Sky）の実行時パラメータ。constants.ts の SKY が初期値。 */
export type SkyParams = {
  -readonly [K in keyof typeof SKY]: number;
};

/** 雲レイヤーの実行時パラメータ。constants.ts の CLOUDS が初期値。 */
export type CloudParams = {
  -readonly [K in keyof typeof CLOUDS]: number;
};

/** 夜光虫タイムライン（/public の JSON）の 1 イベント。 */
export type NightSeaEvent = {
  /** ループ内の発火時刻（秒）。 */
  time: number;
  /** wavePulse = 波のうねり強調 / sparkle = 粒子のきらめき。 */
  type: 'wavePulse' | 'sparkle';
  /** 0..1 の強度。 */
  intensity: number;
};

/** 夜光虫タイムライン JSON 全体の形。 */
export type NightSeaTimeline = {
  /** ループ全体の長さ（秒）。 */
  durationSeconds: number;
  events: NightSeaEvent[];
};

/**
 * ページ側（ScrollTrigger）から渡される重力エフェクトの入力。
 * ShowroomCanvas 経由で Showroom#setGravity() に届く。
 */
export type GravityInput = {
  /** 引力の強さ 0..1.18。 */
  strength: number;
  /** セクション境界スクロールの進捗 0..1。 */
  progress: number;
  /** スクロール方向。1 = 下へ / -1 = 上へ。 */
  direction: 1 | -1;
};

/* ------------------------------------------------------------
 * 各シーンパーツ（parts/*）が返す「リグ」。
 * メッシュとマテリアルなど、フレームループで触るものをまとめた束。
 * ------------------------------------------------------------ */

/** 雲レイヤーのリグ。 */
export type CloudsRig = {
  /** 地平線上に浮かぶ横長の雲プレーン。 */
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  /** uTime / uOpacity などを毎フレーム更新するマテリアル。 */
  material: THREE.ShaderMaterial;
};

/** 海面のリグ。 */
export type FloorRig = {
  /** X軸 -90° 回転で水平に敷いた海プレーン。 */
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  /** 波・反射・露出のユニフォームを持つマテリアル。 */
  material: THREE.ShaderMaterial;
};

/** 重力フィールド（加算ブレンドの光の柱）のリグ。 */
export type GravityFieldRig = {
  /** カメラ正面に貼り付くフルスクリーンの歪みプレーン。 */
  plane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  /** uGravity / uProgress などを毎フレーム更新するマテリアル。 */
  material: THREE.ShaderMaterial;
};

/** 重力遷移用フルスクリーン合成パスのリグ。 */
export type CompositePassRig = {
  /** フルスクリーンクアッドだけを持つ専用シーン。 */
  scene: THREE.Scene;
  /** クアッド描画用の正射影カメラ。 */
  camera: THREE.OrthographicCamera;
  /** 2 枚のシーンテクスチャを RGB シフト付きで合成するマテリアル。 */
  material: THREE.ShaderMaterial;
};

/** 光の粒（モート）のリグ。 */
export type MotesRig = {
  /** 加算ブレンドのポイントクラウド。 */
  points: THREE.Points;
  /** 各粒子の基準位置（漂いの中心）。 */
  basePositions: Float32Array;
  /** 各粒子の漂い速度。 */
  speeds: number[];
  /** 各粒子の位相シード（動きをばらけさせる乱数）。 */
  seeds: number[];
};

/** updateMotes() に毎フレーム渡すコンテキスト。 */
export type MotesFrameContext = {
  /** 経過時間（秒）。 */
  t: number;
  /** 投影 / 逆投影に使うメインカメラ。 */
  camera: THREE.PerspectiveCamera;
  /** ポインタの正規化 X（-1..1）。 */
  px: number;
  /** ポインタの正規化 Y（-1..1）。 */
  py: number;
  /** 重力エフェクトの実効強度（粒子が中央へ集まる量）。 */
  gravityStretch: number;
  /** きらめきパルス（NightSea 由来）。 */
  sparklePulse: number;
  /** prefers-reduced-motion が有効か。有効ならカーソル磁石を無効化。 */
  reduced: boolean;
};

/** 展示 1 点の配置定義（parts/exhibits.ts の PLACEMENTS で使用）。 */
export type ExhibitPlacement = {
  /** 表示する作品（動画）の識別子。 */
  theme: ExhibitTheme;
  /** ギャラリー内のワールド座標 [x, y, z]。 */
  pos: [number, number, number];
  /** 通路へ向く向き。1 = 左壁 / -1 = 右壁。 */
  facing: 1 | -1;
  /** フレーム面積（16:9 に整形する前の基準値）。 */
  area: number;
};

/**
 * ホバー / クリック判定に使う展示 1 点の対象。
 * Raycaster で mesh を当て、material の uHover を駆動し、
 * クリック時に href へ同一タブ遷移する。
 */
export type ExhibitTarget = {
  /** 作品（動画）の識別子。 */
  theme: ExhibitTheme;
  /** レイキャスト対象となる作品プレートのメッシュ。 */
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  /** uHover / uTime を持つプレートのシェーダーマテリアル。 */
  material: THREE.ShaderMaterial;
  /** クリック時の遷移先 URL。 */
  href: string;
};

