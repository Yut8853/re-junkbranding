// ============================================================
// ホバーグリッチ フラグメントシェーダー
// 散らばりギャラリーのパネル画像に RGB 分離・スライス・
// 走査線・グレインを重ねる。uHover (0..1) が全エフェクトの
// 強度ゲートで、ホバーのフェードイン / アウトに追従する。
// ============================================================
precision highp float;

uniform sampler2D uImage;  // パネルの画像
uniform vec2 uImageSize;   // 画像の実サイズ（px）
uniform vec2 uCanvasSize;  // キャンバスサイズ（px）
uniform float uHover;      // ホバー強度 0..1
uniform float uTime;

varying vec2 vUv;

// 2D ハッシュ（疑似乱数）。
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// cover フィット: 余白が出ないようにはみ出す側を切り抜く。
vec2 coverUv(vec2 uv) {
  float canvasAspect = uCanvasSize.x / max(uCanvasSize.y, 0.0001);
  float imageAspect = uImageSize.x / max(uImageSize.y, 0.0001);
  vec2 scale = vec2(1.0);

  if (imageAspect > canvasAspect) {
    scale.x = canvasAspect / imageAspect;
  } else {
    scale.y = imageAspect / canvasAspect;
  }

  return clamp((uv - 0.5) * scale + 0.5, vec2(0.001), vec2(0.999));
}

void main() {
  vec2 uv = coverUv(vUv);

  // --- 横スライス: 画面を 38 行に割り、時間で点滅する行を横にずらす ---
  float row = floor(vUv.y * 38.0);
  float timeStep = floor(uTime * 18.0); // 18fps 相当でカクつかせる
  float stripeNoise = hash(vec2(row, timeStep));
  float stripe = step(0.58 - uHover * 0.46, stripeNoise); // ホバーが強いほど縞が増える
  float thinBand = 1.0 - smoothstep(0.0, 0.04, abs(fract(vUv.y * 38.0) - 0.5));
  float slice = (hash(vec2(row * 4.7, timeStep + 9.0)) - 0.5) * stripe * thinBand * uHover * 0.6;
  // さらに細かい行単位の微細ジッター。
  float jitter = (hash(vec2(floor(vUv.y * 118.0), timeStep * 2.0)) - 0.5) * uHover * 0.06;
  vec2 shifted = uv + vec2(slice + jitter, 0.0);

  // --- RGB チャンネル分離（縞の上では分離量が増える） ---
  float chroma = uHover * (0.035 + stripe * 0.09);
  float verticalChroma = uHover * stripe * thinBand * 0.03;
  vec2 redUv = clamp(shifted + vec2(chroma, verticalChroma), vec2(0.001), vec2(0.999));
  vec2 greenUv = clamp(shifted, vec2(0.001), vec2(0.999));
  vec2 blueUv = clamp(shifted - vec2(chroma, verticalChroma), vec2(0.001), vec2(0.999));

  vec3 color;
  color.r = texture2D(uImage, redUv).r;
  color.g = texture2D(uImage, greenUv).g;
  color.b = texture2D(uImage, blueUv).b;

  // --- グレイン・色付きの縞光・走査線 ---
  float grain = hash(vUv * uCanvasSize + uTime * 61.0) - 0.5;
  float scan = sin(vUv.y * uCanvasSize.y * 1.35) * 0.5 + 0.5;
  color += grain * uHover * 0.6;                                  // 砂嵐ノイズ
  color += vec3(0.1, 0.36, 1.0) * stripe * thinBand * uHover * 0.8; // 青い縞光
  color += vec3(1.0, 0.12, 0.42) * stripe * uHover * 0.22;          // 赤の差し色
  color *= 1.0 + uHover * 0.6;                                    // 全体を増光
  color *= mix(1.0, 0.74 + scan * 0.9, uHover * 0.72);            // 走査線の明滅

  gl_FragColor = vec4(color, 1.0);
}
