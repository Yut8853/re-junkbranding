import * as THREE from 'three';
import exhibitVert from '../shaders/exhibit.vert.glsl?raw';
import exhibitFrag from '../shaders/exhibit.frag.glsl?raw';
import { EXHIBIT_LINK_HREF, EXHIBIT_SCALE, EXHIBIT_VIDEO_SRC, FULL_HD_ASPECT } from '../constants';
import { makeExhibitTexture, makeGlowTexture, type ExhibitTheme } from '../textures';
import type { ExhibitPlacement, ExhibitTarget, Track } from '../types';

/**
 * 展示の配置リスト。サイトの動画 6 本を 1 点ずつ、
 * 左右の壁に少し不規則なリズムで並べる。
 */
const PLACEMENTS: ExhibitPlacement[] = [
  { theme: 'toPlace', pos: [7.35, 3.45, -2.8], facing: -1, area: 3.0 * 3.7 },
  { theme: 'transB', pos: [-7.25, 1.8, -5.7], facing: 1, area: 2.35 * 3.05 },
  { theme: 'luzReal', pos: [-7.45, 3.85, -9.2], facing: 1, area: 3.35 * 4.45 },
  { theme: 'iwakiki', pos: [7.55, 2.05, -12.1], facing: -1, area: 2.45 * 3.1 },
  { theme: 'junk', pos: [7.2, 3.25, -15.7], facing: -1, area: 3.15 * 4.05 },
  { theme: 'next', pos: [-7.05, 2.72, -19.6], facing: 1, area: 2.55 * 3.25 },
];

/** 面積指定からフル HD（16:9）の [幅, 高さ] を求める。 */
function fullHdFrameSize(area: number): [number, number] {
  const width = Math.sqrt(area * EXHIBIT_SCALE * FULL_HD_ASPECT);
  return [width, width / FULL_HD_ASPECT];
}

/** テクスチャ画像の実サイズを取得する（未取得時はプレースホルダー値）。 */
function textureSize(tex: THREE.Texture): THREE.Vector2 {
  const image = tex.image as { width?: number; height?: number } | undefined;
  return new THREE.Vector2(image?.width || 640, image?.height || 800);
}

/**
 * 動画の再生を試みる。自動再生がブロックされても例外にせず黙って続行
 * （ユーザー操作後に start() で再試行される）。
 */
export function playExhibitVideo(video: HTMLVideoElement): void {
  const play = video.play();
  if (play) play.catch(() => undefined);
}

/**
 * 展示用のループ動画要素を生成する。
 * iOS Safari などでのインライン自動再生に必要な属性を
 * プロパティと HTML 属性の両方で設定している。
 */
function makeExhibitVideo(theme: ExhibitTheme, videos: HTMLVideoElement[]): HTMLVideoElement {
  const video = document.createElement('video');
  video.src = EXHIBIT_VIDEO_SRC[theme];
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('muted', '');
  video.setAttribute('loop', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.addEventListener('canplay', () => playExhibitVideo(video), { once: true });
  video.load();
  videos.push(video);
  return video;
}

/**
 * 作品プレートのマテリアルを生成する。
 *
 * まず Canvas 製のプレースホルダーテクスチャを貼っておき、
 * 動画のメタデータが届き次第 VideoTexture へ差し替える。
 * exhibit シェーダーが cover 風に切り抜くので、
 * フレームサイズと画像サイズの両方をユニフォームで渡す。
 */
function makePlateMaterial(
  theme: ExhibitTheme,
  size: [number, number],
  videos: HTMLVideoElement[],
  track: Track,
): THREE.ShaderMaterial {
  const placeholder = track(makeExhibitTexture(theme));
  placeholder.wrapS = THREE.ClampToEdgeWrapping;
  placeholder.wrapT = THREE.ClampToEdgeWrapping;

  const mat = track(
    new THREE.ShaderMaterial({
      vertexShader: exhibitVert,
      fragmentShader: exhibitFrag,
      uniforms: {
        uMap: { value: placeholder },
        uImageSize: { value: textureSize(placeholder) },
        uFrameSize: { value: new THREE.Vector2(size[0], size[1]) },
        uTint: { value: new THREE.Color(0xcfd0d6) }, // わずかに沈めた色調
        uImageScroll: { value: 0 },
        uHover: { value: 0 }, // ホバー強度 0..1（Showroom 側でイージング）
        uTime: { value: 0 },  // グリッチ駆動用の経過時間
      },
    }),
  );

  const video = makeExhibitVideo(theme, videos);
  const videoTex = track(new THREE.VideoTexture(video));
  videoTex.colorSpace = THREE.SRGBColorSpace;
  videoTex.minFilter = THREE.LinearFilter;
  videoTex.magFilter = THREE.LinearFilter;
  videoTex.wrapS = THREE.ClampToEdgeWrapping;
  videoTex.wrapT = THREE.ClampToEdgeWrapping;

  // 動画の実サイズが分かったタイミングでテクスチャを差し替える。
  const applyVideoTexture = () => {
    mat.uniforms.uMap.value = videoTex;
    mat.uniforms.uImageSize.value.set(video.videoWidth || 1920, video.videoHeight || 1080);
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    applyVideoTexture();
  } else {
    video.addEventListener('loadedmetadata', applyVideoTexture, { once: true });
  }

  return mat;
}

/**
 * 展示 1 点（マット + 作品プレート + スポットライト）を組み立てて
 * シーンへ追加し、ホバー判定に使う対象（プレート + マテリアル + href）を返す。
 */
function buildExhibit(
  scene: THREE.Scene,
  placement: ExhibitPlacement,
  videos: HTMLVideoElement[],
  track: Track,
): ExhibitTarget {
  const { theme, pos, facing } = placement;
  const size = fullHdFrameSize(placement.area);
  const group = new THREE.Group();
  const [pw, ph] = size;

  // 薄いマットな台座。作品の周りの静かな余白として +0.16 だけ大きくする。
  const frameMat = track(new THREE.MeshBasicMaterial({ color: 0x0c0d12, fog: true }));
  const frame = new THREE.Mesh(track(new THREE.PlaneGeometry(pw + 0.16, ph + 0.16)), frameMat);
  group.add(frame);

  // 作品本体: 固定フレームの中で自動再生のサイト動画がループする。
  const plateMat = makePlateMaterial(theme, size, videos, track);
  const plate = new THREE.Mesh(track(new THREE.PlaneGeometry(pw, ph)), plateMat);
  plate.position.z = 0.02; // マットの少し手前へ
  group.add(plate);

  // 作品の上にかける柔らかなスポットライト。
  // 「意図的に照らされている」が、控えめで作品の階調を奪わない強さ。
  const spotTex = track(makeGlowTexture());
  const spotMat = track(
    new THREE.SpriteMaterial({
      map: spotTex,
      color: theme === 'luzReal' ? 0xdcecff : 0xf3f7ff,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: true,
    }),
  );
  const spot = new THREE.Sprite(spotMat);
  spot.scale.set(pw * 1.5, ph * 1.2, 1);
  spot.position.set(0, ph * 0.1, 0.05);
  group.add(spot);

  group.position.set(pos[0], pos[1], pos[2]);
  // 通路へ向け、入口側へわずかに角度をつけて「迎える」姿勢にする。
  group.rotation.y = facing * Math.PI * 0.5 - facing * 0.14;
  scene.add(group);

  return { theme, mesh: plate, material: plateMat, href: EXHIBIT_LINK_HREF[theme] };
}

/**
 * すべての展示を組み立ててシーンへ追加し、再生制御用の動画要素配列と
 * ホバー / クリック判定用の対象配列を返す。
 */
export function buildExhibits(
  scene: THREE.Scene,
  track: Track,
): { videos: HTMLVideoElement[]; targets: ExhibitTarget[] } {
  const videos: HTMLVideoElement[] = [];
  const targets: ExhibitTarget[] = [];
  for (const placement of PLACEMENTS) {
    targets.push(buildExhibit(scene, placement, videos, track));
  }
  return { videos, targets };
}
