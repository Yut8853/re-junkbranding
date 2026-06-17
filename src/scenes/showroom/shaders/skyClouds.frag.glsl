// ============================================================
// 頭上の雲 フラグメントシェーダー
// 真上を向いたときに見える、水平な雲の天井。
// 海のうねりと同じくゆっくり「ランダムに」漂わせるため、
// fbm を 2 方向にドリフトさせて重ねる。
// ============================================================
precision highp float;

uniform float uTime;
uniform float uOpacity;   // 雲全体の不透明度
uniform float uFlowSpeed; // 漂う速さ
uniform float uScale;     // ノイズスケール
uniform float uWave;      // 海のうねりパルス（0..1 付近）と連動した微かな脈動

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

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
  vec2 p = vUv * uScale;

  // 2 方向の異なるドリフトを重ね、固定パターンに見えない「ランダムな流れ」を作る。
  vec2 drift1 = vec2(uTime * uFlowSpeed, uTime * uFlowSpeed * 0.62);
  vec2 drift2 = vec2(-uTime * uFlowSpeed * 0.48, uTime * uFlowSpeed * 0.9);

  // ドメインワープで雲のかたまりを有機的にうねらせる。
  float n1 = fbm(p + drift1 + fbm(p * 0.5 + uTime * 0.02) * 0.8);
  float n2 = fbm(p * 1.7 + vec2(23.0, 9.0) + drift2);
  float density = n1 * 0.7 + n2 * 0.4;

  // 海のうねりに合わせて雲の濃さがわずかに息づく。
  density += uWave * 0.05;

  float cloud = smoothstep(0.45, 0.72, density);
  float coreM = smoothstep(0.62, 0.84, density);

  // プレーンの端が直線で見えないよう、四辺を柔らかくフェードする。
  float edge =
      smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.82, 1.0, vUv.x)) *
      smoothstep(0.0, 0.18, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.y));

  vec3 body = vec3(0.88, 0.91, 0.98);
  vec3 core = vec3(1.0, 0.86, 0.76);
  vec3 color = mix(body, core, coreM);

  float alpha = cloud * edge * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
