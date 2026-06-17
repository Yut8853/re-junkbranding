// ============================================================
// 展示プレート フラグメントシェーダー
// 動画 / 画像テクスチャを CSS の object-fit: cover 相当で
// フレームに切り抜き、縁に内側の影を落とす。
// ホバー時（uHover）には強めのグリッチ + RGB シフトを重ねる。
// ============================================================
precision highp float;

uniform sampler2D uMap;     // 動画 or プレースホルダーのテクスチャ
uniform vec2 uImageSize;    // テクスチャの実サイズ（px）
uniform vec2 uFrameSize;    // フレームのワールドサイズ
uniform vec3 uTint;         // 全体の色調（わずかに沈めて空間に馴染ませる）
uniform float uImageScroll; // 縦長画像の表示位置 0..1（上端..下端）
uniform float uHover;       // ホバー強度 0..1（イージング済み）
uniform float uTime;        // 経過時間（秒）。グリッチのアニメーション用

varying vec2 vUv;

// cover フィット: フレームとテクスチャのアスペクト比を比べ、
// 余白が出ないようにはみ出す側を切り抜く。
vec2 coverUv(vec2 uv) {
  float frameAspect = uFrameSize.x / max(uFrameSize.y, 0.0001);
  float imageAspect = uImageSize.x / max(uImageSize.y, 0.0001);
  vec2 scale = vec2(1.0);

  if (imageAspect > frameAspect) {
    scale.x = frameAspect / imageAspect; // 画像が横長 → 左右を切る
  } else {
    scale.y = imageAspect / frameAspect; // 画像が縦長 → 上下を切る
  }

  vec2 covered = (uv - 0.5) * scale + 0.5;
  // 縦に切り抜かれた量のぶんだけ、uImageScroll で表示位置を上下に動かせる。
  float verticalTravel = max(0.0, 1.0 - scale.y);
  covered.y += verticalTravel * (0.5 - clamp(uImageScroll, 0.0, 1.0));
  return clamp(covered, vec2(0.001), vec2(0.999));
}

// 安価な擬似乱数（ハッシュ）。グリッチの段差や走査線に使う。
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vec2 uv = coverUv(vUv);

  float h = clamp(uHover, 0.0, 1.0);

  // ---- グリッチ: 横方向の帯ごとに UV をブロック状にずらす ----
  // 時間で切り替わる帯を作り、帯ごとにランダムな水平ジャンプを与える。
  float blockRows = mix(8.0, 26.0, h);
  float row = floor(vUv.y * blockRows);
  float glitchClock = floor(uTime * 18.0);
  float lineNoise = hash(row * 9.17 + glitchClock);
  // しきい値を超えた帯だけが大きくずれる（断続的なテアリング）。
  float tear = step(0.74, lineNoise) * (lineNoise - 0.74) / 0.26;
  float jump = (hash(row + glitchClock * 1.7) - 0.5) * tear;
  uv.x += jump * 0.18 * h;

  // 細かな全体ジッター（小刻みな揺れ）。
  float jitter = (hash(glitchClock * 3.1) - 0.5) * 0.012 * h;
  uv.x += jitter;

  // ---- RGB シフト: 中心から外へ向かって色ズレ量を増やす ----
  // 走査線状の揺らぎを乗せ、派手なクロマティックアバレーションにする。
  float wave = sin(vUv.y * 140.0 + uTime * 22.0);
  float shift = (0.018 + 0.012 * wave + tear * 0.05) * h;
  vec2 dir = vec2(1.0, 0.0);

  float r = texture2D(uMap, clamp(uv + dir * shift, vec2(0.001), vec2(0.999))).r;
  float g = texture2D(uMap, uv).g;
  float b = texture2D(uMap, clamp(uv - dir * shift, vec2(0.001), vec2(0.999))).b;
  vec3 texel = vec3(r, g, b);

  // ---- 走査線 / スキャンラインの明暗（ホバー時のみ）----
  float scan = 1.0 - 0.18 * h * step(0.5, fract(vUv.y * blockRows * 1.5 + uTime * 6.0));
  texel *= scan;

  // ホバー時はわずかに色を持ち上げてコントラストを強調。
  texel = mix(texel, texel * 1.18 + 0.04, h);

  // 4 辺いずれかへの最短距離。縁ほど 0 に近づく。
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  // 縁の 13% 幅に最大 12% の内側シャドウを落とし、額装の奥行きを出す。
  float innerShadow = 1.0 - smoothstep(0.0, 0.13, edge) * 0.12;
  vec3 color = texel * uTint * innerShadow;

  // ホバー時は縁取りを淡く発光させ、選択中であることを示す。
  float rim = smoothstep(0.06, 0.0, edge) * h;
  color += vec3(0.35, 0.55, 0.85) * rim * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
