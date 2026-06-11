// ============================================================
// 雲 フラグメントシェーダー
// fbm ノイズの層雲を 2 層流し、地平線の上にたなびく
// 軽やかな雲のバンドを描く。
// ============================================================
precision highp float;

uniform float uTime;
uniform float uOpacity;   // 雲全体の不透明度
uniform float uFlowSpeed; // 手前→奥への流れの速さ
uniform float uScaleX;    // ノイズの横スケール
uniform float uScaleY;    // ノイズの縦スケール

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
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// fbm: 5 オクターブのノイズ重ね合わせ。
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.04 + vec2(13.7, 7.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  // 2 層の層雲をスクリーン空間で上方向に流す。
  // このプレーンは展示の奥・地平線のすぐ上にあるため、
  // 見た目には「手前から奥へ」流れているように映る。
  float frontToBack = uTime * uFlowSpeed;
  vec2 p1 = vec2(vUv.x * uScaleX, vUv.y * uScaleY - frontToBack);
  vec2 p2 = vec2(vUv.x * uScaleX * 1.62 + 41.7, vUv.y * uScaleY * 1.55 + 9.3 - frontToBack * 1.8);

  // 1 層目は fbm を fbm で歪ませて（ドメインワープ）有機的な形にする。
  float n1 = fbm(p1 + fbm(p1 * 1.7 + uTime * 0.01) * 0.62);
  float n2 = fbm(p2);
  float density = n1 * 0.74 + n2 * 0.36;

  // しきい値は低めに設定: 夕暮れの空に対して雲が見える濃さを保ちつつ、
  // 雲のかたまりの合間に晴れ間が残るバランス。
  float cloud = smoothstep(0.43, 0.64, density);
  // 各かたまりの内側に、より明るく濃い芯を作る。
  float core = smoothstep(0.58, 0.78, density);

  // バンドを柔らかく保つ: 上端でフェードアウトし、下は地平線へ溶かす。
  float vertical = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.72, 1.0, vUv.y));
  float horizontal = smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.88, 1.0, vUv.x));

  // 軽やかなパレット: ほぼ白の本体に、薔薇色に照らされた柔らかい芯。
  // 重たい雨雲ではなく、軽く夢見るような雲に読ませる。
  vec3 bodyColor = vec3(0.86, 0.9, 0.97);
  vec3 coreColor = vec3(1.0, 0.85, 0.74);
  vec3 color = mix(bodyColor, coreColor, core);

  float alpha = cloud * vertical * horizontal * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
