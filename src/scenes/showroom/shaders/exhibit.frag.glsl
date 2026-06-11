// ============================================================
// 展示プレート フラグメントシェーダー
// 動画 / 画像テクスチャを CSS の object-fit: cover 相当で
// フレームに切り抜き、縁に内側の影を落とす。
// ============================================================
precision highp float;

uniform sampler2D uMap;     // 動画 or プレースホルダーのテクスチャ
uniform vec2 uImageSize;    // テクスチャの実サイズ（px）
uniform vec2 uFrameSize;    // フレームのワールドサイズ
uniform vec3 uTint;         // 全体の色調（わずかに沈めて空間に馴染ませる）
uniform float uImageScroll; // 縦長画像の表示位置 0..1（上端..下端）

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

void main() {
  vec2 uv = coverUv(vUv);
  vec4 texel = texture2D(uMap, uv);

  // 4 辺いずれかへの最短距離。縁ほど 0 に近づく。
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  // 縁の 13% 幅に最大 12% の内側シャドウを落とし、額装の奥行きを出す。
  float innerShadow = 1.0 - smoothstep(0.0, 0.13, edge) * 0.12;
  vec3 color = texel.rgb * uTint * innerShadow;

  gl_FragColor = vec4(color, 1.0);
}
