import GUI from 'lil-gui';
import type { CopyableShowroomPreset, ShowroomGuiOptions } from './types';

/**
 * チューニングパネル（lil-gui）の生成。
 *
 * Sky / Sky Flow / Sea の 3 フォルダと「Copy sky + sea JSON」アクションを持つ。
 * パラメータオブジェクトは Showroom が所有する実行時状態を直接編集し、
 * ユニフォームへの反映が必要な項目だけ onChange コールバックで通知する
 * （海の数値系は frame() が毎フレーム読むのでコールバック不要）。
 */
export function createShowroomGui(options: ShowroomGuiOptions): GUI {
  injectGuiStyles();
  const gui = new GUI({ title: 'Sky / Sea' });
  gui.domElement.style.zIndex = '80';

  const { skyParams, cloudParams, waterParams, waterColors } = options;

  // 空: 散乱パラメータと太陽位置。変更は即ユニフォームへ反映。
  const skyFolder = gui.addFolder('Sky');
  skyFolder.add(skyParams, 'turbidity', 0, 20, 0.01).onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'rayleigh', 0, 4, 0.01).onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'mieCoefficient', 0, 0.1, 0.0001).onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'mieDirectionalG', 0, 1, 0.01).onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'elevationDeg', -5, 20, 0.1).name('sun elevation').onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'azimuthDeg', -180, 180, 1).onChange(options.onSkyChange);
  skyFolder.add(skyParams, 'exposure', 0, 1.2, 0.01).onChange(options.onSkyChange);

  // 雲: 濃さ・流れ・配置。
  const cloudFolder = gui.addFolder('Sky Flow');
  cloudFolder.add(cloudParams, 'opacity', 0, 1, 0.01).onChange(options.onCloudChange);
  cloudFolder.add(cloudParams, 'flowSpeed', -0.2, 0.2, 0.001).name('front to back speed').onChange(options.onCloudChange);
  cloudFolder.add(cloudParams, 'scaleX', 1, 18, 0.1).onChange(options.onCloudChange);
  cloudFolder.add(cloudParams, 'scaleY', 0.5, 8, 0.1).onChange(options.onCloudChange);
  cloudFolder.add(cloudParams, 'height', 6, 38, 0.1).onChange(options.onCloudChange);
  cloudFolder.add(cloudParams, 'distance', -150, -30, 1).onChange(options.onCloudChange);

  // 海: 波形・フェード・配色。数値系は frame() が毎フレーム読むため
  // onChange 不要。向きと色だけ即時反映のコールバックを張る。
  const seaFolder = gui.addFolder('Sea');
  seaFolder.add(waterParams, 'waveStrength', 0, 0.6, 0.001);
  seaFolder.add(waterParams, 'waveScale', 1, 80, 0.1);
  seaFolder.add(waterParams, 'waveSpeed', -2, 2, 0.001).name('front to back speed');
  seaFolder.add(waterParams, 'rippleStrength', 0, 0.2, 0.001);
  seaFolder.add(waterParams, 'rippleScale', 1, 80, 0.1);
  seaFolder.add(waterParams, 'rippleSpeed', -2, 2, 0.001);
  seaFolder.add(waterParams, 'flowDirectionX', -1, 1, 0.01).onChange(options.onFlowDirectionChange);
  seaFolder.add(waterParams, 'flowDirectionY', -1, 1, 0.01).onChange(options.onFlowDirectionChange);
  seaFolder.add(waterParams, 'crestSoftness', 0, 1, 0.001);
  seaFolder.add(waterParams, 'fogStrength', 0, 1, 0.001);
  seaFolder.add(waterParams, 'horizonFade', 0, 1, 0.001);
  seaFolder.add(waterParams, 'vignetteStrength', 0, 1, 0.001);
  seaFolder.add(waterParams, 'depthDarkness', 0, 1, 0.001);
  seaFolder.add(waterParams, 'parallaxStrength', 0, 1, 0.001);
  seaFolder.add(waterParams, 'cameraForwardAmount', 0, 1, 0.001);
  seaFolder.addColor(waterColors, 'base').onChange(options.onWaterColorsChange);
  seaFolder.addColor(waterColors, 'shallow').onChange(options.onWaterColorsChange);
  seaFolder.addColor(waterColors, 'crest').onChange(options.onWaterColorsChange);
  seaFolder.add(waterColors, 'brightness', 0, 3, 0.01).onChange(options.onWaterColorsChange);

  // 現在値を JSON としてクリップボードへ書き出す（プリセット保存用）。
  const actions = {
    copy: () => copyShowroomPreset({
      sky: { ...skyParams },
      clouds: { ...cloudParams },
      sea: { ...waterParams },
      seaColors: { ...waterColors },
    }),
  };
  gui.add(actions, 'copy').name('Copy sky + sea JSON');
  gui.close();

  return gui;
}

/**
 * プリセット JSON をクリップボードへコピーする。
 * Clipboard API が使えない / 拒否された場合は prompt で手動コピーに切り替える。
 */
function copyShowroomPreset(preset: CopyableShowroomPreset): void {
  const text = JSON.stringify(preset, null, 2);
  const copied = navigator.clipboard?.writeText(text);
  if (!copied) {
    window.prompt('Copy sky + sea JSON', text);
    return;
  }

  copied.catch(() => {
    window.prompt('Copy sky + sea JSON', text);
  });
}

/**
 * lil-gui をサイトのトーン（夕暮れの青 + ガラス調）に合わせるスタイルを
 * 1 度だけ <head> に注入する。lil-gui の CSS 変数を上書きする方式。
 */
function injectGuiStyles(): void {
  if (document.getElementById('showroom-lil-gui-style')) return;

  const style = document.createElement('style');
  style.id = 'showroom-lil-gui-style';
  style.textContent = `
    .lil-gui {
      --background-color: rgba(36, 63, 99, 0.78);
      --widget-color: rgba(255, 255, 255, 0.12);
      --hover-color: rgba(255, 255, 255, 0.18);
      --focus-color: rgba(255, 255, 255, 0.22);
      --number-color: #f2a77d;
      --string-color: #9fd7ff;
      --font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      color: #f8f4ef;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 8px;
      backdrop-filter: blur(16px);
    }
    .lil-gui.root {
      top: 14px;
      right: 14px;
    }
    .lil-gui .title {
      color: #fff5eb;
      letter-spacing: 0;
    }
    .lil-gui input,
    .lil-gui select,
    .lil-gui button {
      color: inherit;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}
