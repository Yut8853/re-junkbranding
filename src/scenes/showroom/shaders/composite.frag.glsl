// ============================================================
// 重力遷移 合成フラグメントシェーダー
// カメラをずらして描いた 2 枚のシーン (tSceneA / tSceneB) を、
// 縦ストレッチ歪み・グリッチ縞・明るい RGB シフトで
// ブレンドして画面に出す。セクション境界スクロール中のみ使われる。
// ============================================================
precision highp float;

uniform sampler2D tSceneA;     // ずらし描画 1 枚目（引き込まれる側）
uniform sampler2D tSceneB;     // ずらし描画 2 枚目（残る側）
uniform float uProgress;       // 遷移進捗 0..1（A→B の受け渡し）
uniform float uIntensity;      // エフェクト全体の強度
uniform float uTime;
uniform float uDirection;      // スクロール方向 (+1 / -1)
uniform vec2 uMouse;           // ポインタ位置 (-1..1)
uniform vec2 uMouseVelocity;   // ポインタ速度
uniform vec2 uResolution;      // 画面解像度（px）

varying vec2 vUv;

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

// 9 タップの方向ブラー。axis 方向に重み付きでサンプリングする。
vec3 blurScene(sampler2D tex, vec2 uv, vec2 axis, float amount) {
  vec3 color = vec3(0.0);
  float total = 0.0;

  for (int i = -4; i <= 4; i++) {
    float x = float(i);
    float weight = 1.0 - abs(x) / 5.0; // 中央ほど重い三角フィルタ
    color += texture2D(tex, uv + axis * x * amount).rgb * weight;
    total += weight;
  }

  return color / total;
}

// 重力に引かれる UV 歪み。
// 画面の境界帯（縦中央付近）でノイズに応じて縦方向に圧縮し、
// 「上下に引き伸ばされて吸い込まれる」見え方を作る。
vec2 distortedUv(vec2 uv, float side) {
  // 境界帯の位置自体をノイズで揺らし、直線的な歪みを避ける。
  float warpedY = uv.y + (noise(vec2(uv.x * 2.4, uTime * 0.08)) - 0.5) * 0.08;
  float boundary = smoothstep(0.08, 0.64, warpedY) * (1.0 - smoothstep(0.68, 1.0, warpedY));
  float verticalBand = 1.0 - abs(uv.y - 0.5) * 2.0;
  verticalBand = pow(max(verticalBand, 0.0), 0.55);

  float n1 = noise(vec2(uv.x * 5.2, uv.y * 7.0 - uTime * 0.22));
  float n2 = noise(vec2(uv.x * 13.0 + uTime * 0.08, uv.y * 4.0));
  float combinedNoise = mix(n1, n2, 0.42) * 0.74 + verticalBand * 0.42;

  // exp(-force) で 1（無変形）→ 0（強圧縮）へ滑らかに潰す。
  float stretchForce = uIntensity * 14.2 * combinedNoise * boundary;
  float stretch = exp(-stretchForce);
  // side(±1) と uDirection で A/B・スクロール向きごとに逆方向へずらす。
  float verticalShift = uIntensity * combinedNoise * 0.6 * side * uDirection;
  // ポインタの縦位置にも軽く引かれる。
  float mousePull = (uMouse.y * 0.5) * uIntensity * boundary;
  vec2 distorted = uv;
  distorted.y = (distorted.y - 0.5) * stretch + 0.5 - verticalShift - mousePull;
  distorted.x += (n1 - 0.5) * uIntensity * 0.04 * boundary;
  distorted.x += uMouseVelocity.x * uIntensity * 0.018 * boundary;

  return clamp(distorted, vec2(0.001), vec2(0.999));
}

// 水平のグリッチ縞。画面を 54 行に割り、時間で点滅する行を選ぶ。
float glitchStripe(vec2 uv, float intensity) {
  float row = floor(uv.y * 54.0);
  float rowNoise = hash(vec2(row, floor(uTime * 16.0)));
  float fineNoise = hash(vec2(row * 3.7, floor(uTime * 38.0)));
  float stripeOn = step(0.82 - intensity * 0.18, rowNoise); // 強度が上がるほど縞が増える
  float band = 1.0 - smoothstep(0.0, 0.018, abs(fract(uv.y * 54.0) - 0.5));
  return stripeOn * band * fineNoise * intensity;
}

void main() {
  vec2 uv = vUv;
  vec2 texel = 1.0 / max(uResolution, vec2(1.0));
  // A→B の受け渡しカーブと、中央で最大になる山なり強度。
  float handoff = smoothstep(0.08, 0.92, uProgress);
  float intensity = smoothstep(0.0, 1.0, uIntensity);
  float peak = pow(sin(clamp(uProgress, 0.0, 1.0) * 3.14159265), 0.72);
  float split = intensity * (2.0 + peak * 5.8); // RGB 分離の基本量
  float glitch = glitchStripe(uv, intensity * peak);
  // 中央が淡く光る放射状の背景（アルファ 0 の隙間を埋める）。
  float centerGlow = 1.0 - smoothstep(0.0, 0.84, distance(uv, vec2(0.5, 0.48)));
  vec3 radialBg = mix(vec3(0.18, 0.34, 0.55), vec3(0.98, 0.76, 0.56), pow(centerGlow, 1.55) * 0.36);

  // --- 2 枚のシーンをそれぞれ逆向きに歪ませてサンプリング ---
  vec2 uvA = distortedUv(uv, -1.0);
  vec2 uvB = distortedUv(uv, 1.0);
  uvA.x += (glitch - 0.5) * texel.x * 34.0 * intensity; // 縞による横ズレ
  uvB.x -= (glitch - 0.5) * texel.x * 42.0 * intensity;
  vec2 blurAxis = vec2(0.0, texel.y) * (4.0 + intensity * 18.0); // 縦モーションブラー

  vec4 sampleA = texture2D(tSceneA, uvA);
  vec4 sampleB = texture2D(tSceneB, uvB);
  vec3 colorA = mix(radialBg, blurScene(tSceneA, uvA, blurAxis, intensity * 0.76), sampleA.a);
  vec3 colorB = mix(radialBg, blurScene(tSceneB, uvB, blurAxis, intensity * 0.92), sampleB.a);

  // --- グリッチ縞の上でのみ強い RGB チャンネル分離 ---
  vec2 glitchOffset = vec2((glitch * 18.0 + split) * texel.x, split * texel.y);
  colorA.r = texture2D(tSceneA, uvA + glitchOffset).r;
  colorA.g = texture2D(tSceneA, uvA + vec2(glitch * -10.0 * texel.x, 0.0)).g;
  colorA.b = texture2D(tSceneA, uvA - glitchOffset).b;
  colorB.r = texture2D(tSceneB, uvB + vec2(glitchOffset.x, -glitchOffset.y)).r;
  colorB.g = texture2D(tSceneB, uvB + vec2(glitch * 8.0 * texel.x, 0.0)).g;
  colorB.b = texture2D(tSceneB, uvB - vec2(glitchOffset.x, -glitchOffset.y)).b;

  // --- 境界帯の発光と A/B ブレンド ---
  float glowBandY = uv.y + (noise(vec2(uv.x * 3.6 + uTime * 0.06, 1.0)) - 0.5) * 0.16;
  float gravityGlow = 1.0 - abs(glowBandY - 0.5) * 2.0;
  gravityGlow = pow(max(gravityGlow, 0.0), 2.2) * intensity;
  vec3 mixed = mix(colorA, colorB, handoff);
  mixed = mix(radialBg, mixed, max(sampleA.a, sampleB.a));
  mixed += vec3(0.92, 0.94, 1.0) * pow(centerGlow, 2.4) * 0.08; // 中央の白い光
  mixed += vec3(0.88, 0.94, 1.0) * gravityGlow * 0.1;           // 境界帯の光
  mixed += vec3(0.92, 0.98, 1.0) * glitch * 0.1;                // 縞の白光
  mixed += vec3(0.18, 0.36, 1.0) * glitch * 0.08;               // 縞の青光

  // --- 重力 RGB シフト ---
  // チャンネルを外側へ分離し、スクリーン合成で重ね戻す。
  // 通常の加算や乗算と違い、フレームが暗く沈まず「光の方へ持ち上がる」。
  vec2 rgbShift = vec2(texel.x, texel.y * 0.35) * (7.0 + peak * 24.0) * intensity;
  vec3 shiftA = vec3(
    texture2D(tSceneA, uvA + rgbShift).r,
    texture2D(tSceneA, uvA).g,
    texture2D(tSceneA, uvA - rgbShift).b);
  vec3 shiftB = vec3(
    texture2D(tSceneB, uvB + rgbShift).r,
    texture2D(tSceneB, uvB).g,
    texture2D(tSceneB, uvB - rgbShift).b);
  vec3 shifted = mix(
    mix(radialBg, shiftA, sampleA.a),
    mix(radialBg, shiftB, sampleB.a),
    handoff);
  mixed = 1.0 - (1.0 - mixed) * (1.0 - shifted * intensity * 0.5); // スクリーン合成
  // 引力が効いている間は露出を軽く持ち上げ、空が暗くならないようにする。
  mixed *= 1.0 + intensity * 0.16 + peak * intensity * 0.1;

  // 仕上げの微細グレイン。
  float grain = hash(uv * uResolution + uTime * 19.0) - 0.5;
  mixed += grain * 0.018 * intensity;

  gl_FragColor = vec4(mixed, 1.0);
}
