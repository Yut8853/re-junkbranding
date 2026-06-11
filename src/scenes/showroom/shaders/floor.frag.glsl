// ============================================================
// 海面 フラグメントシェーダー
// 空の反射（疑似スカイ評価）+ 太陽の光の道 + 波頭ハイライトを描く。
// 頂点シェーダー (floor.vert.glsl) が作った波形法線を受け取る。
// ============================================================
precision highp float;

varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;

uniform float uTime;
uniform float uExposure;        // 全体の明るさ（Meaning / Issue で減光）
uniform vec3 uBase;             // 最も深い水の色
uniform vec3 uShallow;          // 光が当たる水の色
uniform vec3 uCrest;            // 波頭ハイライトの色
uniform float uBrightness;      // 最終的な明度倍率
uniform vec3 uCamPos;           // カメラ位置（Showroom と共有）
uniform float uWaveStrength;
uniform float uWaveScale;
uniform float uWaveSpeed;
uniform float uRippleStrength;
uniform float uRippleScale;
uniform float uRippleSpeed;
uniform vec2 uFlowDirection;    // 海流の方向
uniform vec3 uSunDirection;     // 太陽方向（空と共有）
uniform float uCrestSoftness;   // 波頭の柔らかさ（大きいほど細い線）
uniform float uFogStrength;     // 露出の効きの強さ
uniform float uHorizonFade;     // 遠景のフェード量
uniform float uVignetteStrength;// 画面端の減光量
uniform float uDepthDarkness;   // 深い部分の暗さ
uniform float uShowGuides;      // デバッグ: 中心線ガイド表示
uniform float uShowWaterOnly;   // デバッグ: 水の色だけ表示

// 2D ハッシュ（疑似乱数）。
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// バリューノイズ。
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// 海流方向に流れる波頭の白い筋を 1 本分計算する。
// ノイズで波頭の位置を揺らし、まっすぐな縞にならないようにしている。
float waveLine(vec2 p, float scale, float speed, float width) {
  vec2 flow = normalize(uFlowDirection);
  vec2 crossFlow = vec2(flow.y, -flow.x);
  float n = noise(p * scale + flow * -uTime * speed + crossFlow * uTime * speed * 0.37);
  float crest = abs(fract(dot(p, flow) * scale * 0.18 + n * 0.28 - uTime * speed) - 0.5);
  return 1.0 - smoothstep(width, width + 0.035, crest);
}

// 空ドーム（skyPhoto.glsl）と同じ夕暮れパレットを、任意の反射レイに対して
// 評価する。キューブマップなしで水面を本物の「空の鏡」にする要。
vec3 skyReflectionColor(vec3 dir) {
  float upperSky = smoothstep(0.02, 0.82, dir.y);        // 上空の青み
  float horizonGlow = 1.0 - smoothstep(-0.03, 0.34, dir.y); // 地平線の桃色
  float warmCore = 1.0 - smoothstep(-0.02, 0.18, dir.y);    // 太陽近くの金色
  vec3 clearBlue = vec3(0.32, 0.62, 0.94);
  vec3 paleBlue = vec3(0.78, 0.88, 0.99);
  vec3 peach = vec3(1.0, 0.79, 0.64);
  vec3 gold = vec3(1.0, 0.93, 0.74);
  vec3 sky = mix(paleBlue, clearBlue, upperSky);
  sky = mix(sky, peach, horizonGlow * 0.36);
  sky = mix(sky, gold, warmCore * 0.3);

  // 太陽方向への加算ハイライト（広いハロー + 鋭い芯）。
  float sunCos = clamp(dot(dir, normalize(uSunDirection)), 0.0, 1.0);
  sky += vec3(1.0, 0.82, 0.6) * pow(sunCos, 14.0) * 0.4;
  sky += vec3(1.0, 0.9, 0.72) * pow(sunCos, 90.0) * 0.85;
  return sky;
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(uCamPos - vWorld);
  // フレネル: 浅い角度（遠く）ほど反射が強くなる水らしい性質。
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

  // --- 水自体の色（深い色と明るい色のブレンド） ---
  vec3 deep = uBase;
  vec3 shallow = uShallow;
  vec3 col = mix(deep, shallow, 0.35 + fresnel * 0.55);
  col *= mix(1.0, 0.48, clamp(uDepthDarkness, 0.0, 1.0));

  // --- 本物の空反射 ---
  // 視線レイを波打つ法線で反射させ、空パレットで色付けする。
  // これにより海は常に頭上の空の色をまとう。
  vec3 reflDir = reflect(-viewDir, n);
  reflDir.y = max(abs(reflDir.y), 0.02); // 下向き反射は地平線方向へ折り返す
  reflDir = normalize(reflDir);
  vec3 skyRefl = skyReflectionColor(reflDir);
  col = mix(col, skyRefl, 0.16 + fresnel * 0.58);

  // --- 太陽の光の道（サンロード） ---
  // 沈む太陽がカメラへ向かってきらめく光の帯を引く。
  // 波の法線が帯を砕いて、ノイズの shimmer がきらめきを作る。
  vec3 sunDir = normalize(uSunDirection);
  float road = pow(max(dot(reflDir, sunDir), 0.0), 60.0);
  float shimmer = 0.62 + 0.38 * noise(vWorld.xz * 2.6 + vec2(uTime * 0.4, uTime * 1.15));
  col += vec3(1.0, 0.74, 0.4) * road * shimmer * 1.45;
  col += vec3(1.0, 0.9, 0.7) * pow(max(dot(reflDir, sunDir), 0.0), 480.0) * 1.9; // 鋭い中心反射

  // --- 波頭の白い筋 ---
  // 海と分かる程度の動きを残しつつ、文字の邪魔をしない控えめさに抑える。
  float waveScale = uWaveScale * 0.049;
  float rippleScale = uRippleScale * 0.032;
  float crests = waveLine(vWorld.xz, waveScale, uWaveSpeed * 0.16, mix(0.09, 0.018, uCrestSoftness));
  crests += waveLine(vWorld.xz + vec2(12.0, -4.0), rippleScale, -uRippleSpeed * 0.18, 0.034) * 0.45;
  crests *= smoothstep(8.0, 2.0, abs(vWorld.x));            // 中央通路の近くだけ
  crests *= smoothstep(42.0, 4.0, length(vWorld - uCamPos)); // カメラ近くだけ
  crests *= uWaveStrength * 8.0 + uRippleStrength * 5.0;

  col += uCrest * crests * 0.085;
  col += vec3(0.08, 0.12, 0.18) * fresnel * 0.18; // 遠景に薄い青を足す

  // --- 周辺減光と距離フェード ---
  // ギャラリーの両端を暗く保ち、展示と Hero の文字を主役にする。
  float sideFalloff = smoothstep(11.5, 1.5, abs(vWorld.x));
  float dCam = length(vWorld - uCamPos);
  float distanceFade = mix(1.0, smoothstep(78.0, 4.0, dCam), uHorizonFade);
  float vignette = mix(1.0 - uVignetteStrength, 1.0, sideFalloff);
  col *= vignette * distanceFade * mix(1.0, uExposure, uFogStrength) * uBrightness;

  // --- デバッグ表示 ---
  if (uShowWaterOnly > 0.5) {
    col = mix(deep, shallow, 0.5) + vec3(crests * 0.12);
  }

  if (uShowGuides > 0.5) {
    float centerLine = 1.0 - smoothstep(0.0, 0.06, abs(vWorld.x));
    col = mix(col, vec3(0.1, 0.75, 1.0), centerLine * 0.35);
  }

  gl_FragColor = vec4(col, 1.0);
}
