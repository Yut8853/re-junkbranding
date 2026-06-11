import type { ExhibitTheme } from './textures';

/* ============================================================
 * Showroom の調整値（チューニング定数）の集約ファイル。
 * 「数値を変えたいときはここ」を原則にする。
 * 型はすべて types.ts に置く。
 * ============================================================ */

/** レンダラーのクリアカラー兼フォグの色。全体の背景になる夕暮れの青。 */
export const BG = 0x243f63;

/** カメラがギャラリー奥へ歩いていくときの注視点の奥行き（Z 座標）。 */
export const FAR_Z = -30;

/**
 * カーソル磁石の有効半径（スクリーン座標・px）。
 * この距離内の粒子はカーソルへ吸い付き、外側の粒子は通常の漂いを続ける。
 */
export const MOTE_MAGNET_RADIUS_PX = 400;

/** スクロール駆動の重力遷移（セクション境界エフェクト）のチューニング。 */
export const GRAVITY_EFFECT = {
  /** 重力プレーンをカメラ前方に置く距離。 */
  planeDistance: 3,
  /** 引力強度のイージング係数（毎フレームの追従率）。 */
  ease: 0.18,
  /** 進捗のイージング係数。 */
  progressEase: 0.14,
  /** 引力ピーク時にカメラを前方へ引き込む量。 */
  cameraPull: 1.15,
  /** 引力ピーク時にカメラを持ち上げる量。 */
  cameraLift: 0.34,
  /** 引力ピーク時に露出を落とす割合（0 = 落とさない）。 */
  exposureDip: 0.34,
} as const;

/**
 * 夕暮れの空（three.js の Sky）の初期値。
 * 太陽を地平線ぎりぎりに置き、海が太陽を映して
 * 光の道（ライトロード）を手前まで伸ばせるようにしている。
 */
export const SKY = {
  /** 大気の濁り。大きいほど霞む。 */
  turbidity: 4.8,
  /** レイリー散乱。空の青みの強さ。 */
  rayleigh: 2.6,
  /** ミー散乱係数。太陽周辺の光のにじみ。 */
  mieCoefficient: 0.006,
  /** ミー散乱の指向性。1 に近いほど太陽方向に集中。 */
  mieDirectionalG: 0.62,
  /** 太陽の仰角（度）。地平線すれすれ。 */
  elevationDeg: 2.1,
  /** 太陽の方位角（度）。180 = 正面奥。 */
  azimuthDeg: 180,
  /** 空専用の露出（明るさ倍率）。 */
  exposure: 0.86,
} as const;

/** 地平線上を流れる遠景の層雲バンドの初期値。 */
export const CLOUDS = {
  /** 雲の不透明度。 */
  opacity: 0.64,
  /** 手前から奥へ流れる速度。 */
  flowSpeed: 0.034,
  /** ノイズの横方向スケール。 */
  scaleX: 5.2,
  /** ノイズの縦方向スケール。 */
  scaleY: 1.72,
  /** 雲プレーンの高さ（Y 座標）。 */
  height: 17.5,
  /** 雲プレーンの奥行き（Z 座標）。 */
  distance: -94,
} as const;

/** 展示作品ごとの動画ファイル（/public 直下）。 */
export const EXHIBIT_VIDEO_SRC: Record<ExhibitTheme, string> = {
  toPlace: '/toplace.mp4',
  luzReal: '/luzreal.mp4',
  transB: '/trans.mp4',
  iwakiki: '/iwakiki.mp4',
  junk: '/junk.mp4',
  next: '/next.mp4',
};

/** 展示フレームのアスペクト比（フル HD の 16:9 で統一）。 */
export const FULL_HD_ASPECT = 16 / 9;

/** 展示フレームの拡大率。面積指定から実寸を求めるときの係数。 */
export const EXHIBIT_SCALE = 3.18;
