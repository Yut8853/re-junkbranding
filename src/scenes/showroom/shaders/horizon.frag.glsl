// ============================================================
// 地平線シルエット フラグメントシェーダー
// 遠景に置いた縦長プレーンに、下端へ並ぶ稜線（山）または
// スカイライン（町）のシルエットを描く。uMode で形を切り替える。
//   uMode = 0.0 → 山並み（なめらかな稜線）
//   uMode = 1.0 → 町（矩形のビル群＋窓明かり）
// ============================================================
precision highp float;

uniform float uTime;
uniform float uOpacity;
uniform float uMode;        // 0 = 山, 1 = 町
uniform vec3  uColor;       // シルエットの基本色
uniform vec3  uGlowColor;   // 稜線・窓のほのかな色

varying vec2 vUv;

float hash(float x) {
  return fract(sin(x * 127.1) * 43758.5453123);
}

float vnoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}

// 複数オクターブで起伏のある稜線を作る。
float ridge(float x) {
  float h = 0.0;
  h += vnoise(x * 1.3) * 0.5;
  h += vnoise(x * 3.1 + 5.0) * 0.28;
  h += vnoise(x * 7.7 + 11.0) * 0.14;
  return h;
}

// 町のスカイライン: 一定幅のビルがランダムな高さで並ぶ階段状の輪郭。
float skyline(float x) {
  float block = floor(x * 22.0);
  float base = 0.18 + hash(block) * 0.46;
  // 隣のブロックと少しだけ混ぜて高低のリズムを作る。
  float neighbor = hash(block + 1.0);
  return mix(base, base * 0.7 + neighbor * 0.3, 0.35);
}

void main() {
  // 稜線の高さ（0..1 の vUv.y を基準に下から積み上げ）。
  float h = (uMode < 0.5) ? (0.12 + ridge(vUv.x * 4.0) * 0.6)
                          : (skyline(vUv.x));

  // シルエット本体: 稜線より下を塗る。境界はわずかにソフト。
  float silhouette = smoothstep(h + 0.012, h - 0.012, vUv.y);

  // 稜線・屋上のすぐ上に夕日のリムライトをにじませる。
  float rim = smoothstep(h - 0.02, h, vUv.y) * (1.0 - smoothstep(h, h + 0.06, vUv.y));

  vec3 color = mix(uColor, uGlowColor, rim * 0.9);

  float alpha = silhouette;

  // 町モードのときは窓明かりをランダムに灯す。
  if (uMode > 0.5) {
    vec2 cell = vec2(floor(vUv.x * 140.0), floor(vUv.y * 90.0));
    float lit = step(0.82, hash(cell.x * 7.0 + cell.y * 31.0));
    // ゆっくり明滅させる。
    float flicker = 0.6 + 0.4 * sin(uTime * 1.3 + hash(cell.x + cell.y) * 6.28);
    float windows = lit * silhouette * flicker;
    color += uGlowColor * windows * 0.9;
    alpha = max(alpha, windows * 0.5);
  }

  // 左右の端を柔らかくフェードして直線の切れ目を隠す。
  float edge = smoothstep(0.0, 0.06, vUv.x) * (1.0 - smoothstep(0.94, 1.0, vUv.x));
  alpha *= edge * uOpacity;

  gl_FragColor = vec4(color, alpha);
}
