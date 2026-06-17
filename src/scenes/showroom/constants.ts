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
 * スクロール連動のカメラ航路（キーフレーム）。
 *
 * 入口（index 0）から最奥（最後の要素）まで、スクロール進捗 0..1 を
 * セクション数ぶんの区間に等分し、各キーフレーム間を滑らかに補間する。
 * eye = カメラ位置、look = 注視点。これにより「奥へ歩く」だけだった
 * カメラが、空を見上げ・左右へ振れ・最後は海を真上から覗き込む、という
 * 縦横無尽の動きになる。
 *
 * 区間は計 5（= 6 キーフレーム）。重力エフェクト後のセクションごとに
 * カメラの姿勢が大きく変わっていく。
 */
export const CAMERA_PATH: ReadonlyArray<{
  /** カメラ位置 [x, y, z]。 */
  eye: readonly [number, number, number];
  /** 注視点 [x, y, z]。 */
  look: readonly [number, number, number];
}> = [
  // 0: Hero — 入口に立ち、通路の奥をまっすぐ見る。
  { eye: [0, 1.7, 9], look: [0, 1.4, -30] },
  // 1: Meaning — 歩み入りつつ、空を見上げる。
  { eye: [0, 2.6, 2.5], look: [0, 28, -36] },
  // 2: Issue — 視線を右へ大きく振る。
  { eye: [-1.8, 4.4, -2], look: [36, 10, -24] },
  // 3: ScatterGallery — 逆側（左）へ振り、下を覗き始める。
  { eye: [2.4, 6.5, -9], look: [-32, -3, -28] },
  // 4: ServicesIndex — 高く上昇し、海へ向かって大きく傾ける。
  { eye: [0, 18, -17], look: [0, -7, -27] },
  // 5: FinalCta — 海を真上から覗き込む（わずかに前傾して特異点を避ける）。
  { eye: [0, 42, -24], look: [0, -6, -30] },
] as const;

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

/**
 * 頭上の雲（真上を向いたときに見える雲の天井）の初期値。
 * 海と同じ流れでランダムに漂わせる。
 */
export const SKY_CLOUDS = {
  /** 不透明度。 */
  opacity: 0.7,
  /** 漂う速さ。 */
  flowSpeed: 0.012,
  /** ノイズスケール（大きいほど雲が細かい）。 */
  scale: 2.4,
  /** カメラ上空に置く高さ（Y 座標）。 */
  height: 46,
  /** 水平プレーンの一辺の長さ。 */
  size: 320,
} as const;

/**
 * 地平線のシルエット（右を向くと山並み）の初期値。
 * azimuthDeg は配置の方位（度）。0 = 正面奥(-Z)、+90 = 右(+X)、-90 = 左(-X)。
 */
export const HORIZON = {
  /** 右側の山並み。 */
  mountains: {
    azimuthDeg: 78,
    /** シルエット本体の色（夕暮れに沈む濃い藍）。 */
    color: 0x1b2740,
    /** 稜線のリムライト色。 */
    glow: 0xf2b07a,
    opacity: 0.96,
  },
  /** カメラ中心からシルエットまでの距離。 */
  distance: 140,
  /** シルエットプレーンの幅。 */
  width: 300,
  /** シルエットプレーンの高さ（稜線が地平線付近に収まる低めの帯）。 */
  height: 34,
  /** プレーン中心の高さ。下端が地平線のすぐ下に来るよう調整。 */
  baseY: 9,
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

/** 展示作品ごとのクリック遷移先 URL（同一タブで遷移）。 */
export const EXHIBIT_LINK_HREF: Record<ExhibitTheme, string> = {
  toPlace: 'https://to-place.co.jp/',
  luzReal: 'https://luz-real.com/',
  transB: 'https://trans-b.vercel.app/',
  iwakiki: 'https://d2crmzpw5das9r.cloudfront.net/',
  junk: 'https://funky.junkbranding.com/',
  next: 'https://next-inc.group/',
};

/** 展示フレームのアスペクト比（フル HD の 16:9 で統一）。 */
export const FULL_HD_ASPECT = 16 / 9;

/** 展示フレームの拡大率。面積指定から実寸を求めるときの係数。 */
export const EXHIBIT_SCALE = 3.18;
