// ============================================================
// 海面 頂点シェーダー
// fbm（フラクタルノイズ）のうねり + sin 波 + さざ波で
// 頂点を持ち上げ、有限差分で法線を再計算する。
// 色付け・反射はフラグメントシェーダー (floor.frag.glsl) が担当。
// ============================================================
varying vec2 vUv;
varying vec3 vWorld;   // ワールド座標（フラグメント側の距離計算に使う）
varying vec3 vNormal;  // 波形から再計算した法線

uniform float uTime;
uniform float uWaveStrength;   // うねりの高さ
uniform float uWaveScale;      // うねりの細かさ
uniform float uWaveSpeed;      // うねりの速さ
uniform float uRippleStrength; // さざ波の高さ
uniform float uRippleScale;    // さざ波の細かさ
uniform float uRippleSpeed;    // さざ波の速さ
uniform vec2 uFlowDirection;   // 海流の方向（正規化済み）

// 2D ハッシュ（疑似乱数）。
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// バリューノイズ: 格子点のハッシュ値を滑らかに補間する。
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

// fbm: ノイズを 4 オクターブ重ねて自然な濃淡を作る。
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += vnoise(p) * a;
    p = p * 2.13 + vec2(17.3, 9.1); // 周波数を上げつつ位相をずらす
    a *= 0.5;
  }
  return v;
}

// 任意の平面座標 p における波の高さを返す。
float waveHeight(vec2 p) {
  float t = uTime;
  vec2 flow = normalize(uFlowDirection);
  vec2 crossFlow = vec2(flow.y, -flow.x); // 海流に直交する方向
  float waveScale = uWaveScale * 0.023;
  float rippleScale = uRippleScale * 0.02;

  // ノイズによる位相ゆらぎ。波頭が行進せずに揺らぎながら進む。
  float jitter = vnoise(p * 0.05 + t * 0.11) * 6.28;
  float jitter2 = vnoise(p * 0.085 - t * 0.07 + 31.7) * 6.28;

  // --- 基本の 2 方向 sin 波 ---
  float h = 0.0;
  h += sin(dot(p, flow + crossFlow * 0.2) * waveScale - t * uWaveSpeed * 3.27 + jitter * 0.55) * uWaveStrength * 1.1;
  h += sin(dot(p, flow * 0.82 - crossFlow * 0.56) * waveScale - t * uWaveSpeed * 2.18 + jitter2 * 0.6) * uWaveStrength * 0.8;

  // --- 外洋のうねり ---
  // スケールも速度も方向も異なる fbm を 3 層重ねることで、
  // 大きく不規則な水のかたまりがゆったり通り抜けていくように見せる。
  float swellA = fbm(p * 0.034 + flow * -t * uWaveSpeed * 0.62);
  float swellB = fbm(p * 0.017 + (flow * 0.8 + crossFlow * 0.6) * -t * uWaveSpeed * 0.34 + 47.0);
  float swellC = fbm(p * 0.009 + (flow - crossFlow * 0.4) * -t * uWaveSpeed * 0.21 + 113.0);
  h += (swellA - 0.5) * uWaveStrength * 3.6;
  h += (swellB - 0.5) * uWaveStrength * 5.2;
  h += (swellC - 0.5) * uWaveStrength * 6.8;

  // --- 波頭のチョップ ---
  // うねりの山だけを pow で尖らせ、「穏やかな湖」ではなく「海」に読ませる。
  float crestField = swellA * 0.6 + swellB * 0.4;
  h += pow(max(crestField - 0.42, 0.0), 1.6) * uWaveStrength * 4.2;

  // --- 細かいさざ波 ---
  h += sin(dot(p, flow - crossFlow * 0.18) * rippleScale - t * uRippleSpeed * 8.75 + jitter2) * uRippleStrength * 0.88;
  h += sin(dot(p, flow + crossFlow * 0.82) * rippleScale * 1.4 - t * uRippleSpeed * 11.5 + jitter) * uRippleStrength * 0.45;
  return h;
}

void main() {
  vUv = uv;
  vec3 p = position;
  p.z += waveHeight(p.xy); // プレーンは回転前なので法線方向は z

  // 有限差分で勾配を求め、波形に沿った法線を再構成する。
  float eps = 0.22;
  float hx = waveHeight(p.xy + vec2(eps, 0.0)) - waveHeight(p.xy - vec2(eps, 0.0));
  float hy = waveHeight(p.xy + vec2(0.0, eps)) - waveHeight(p.xy - vec2(0.0, eps));
  vec3 localNormal = normalize(vec3(-hx, -hy, eps * 2.0));

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(normalMatrix * localNormal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
