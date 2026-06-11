// ============================================================
// 重力フィールド フラグメントシェーダー
// セクション境界で立ち上がる「光の柱」を描く。
// 中心の細い芯（axis）と広いハロー（halo）を指数減衰で作り、
// 進捗に応じて柱が上下に成長し、先端が光る。加算ブレンド前提。
// ============================================================
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uGravity;     // 引力の強さ（全体のゲート）
uniform float uProgress;    // 遷移進捗 0..1
uniform float uStretchY;    // 柱の縦伸び 0..1
uniform float uDistortion;  // 歪み量
uniform float uLightColumn; // 柱の明るさ
uniform float uDirection;   // スクロール方向 (+1 / -1)
uniform float uAspect;      // 画面アスペクト比

// 2D ハッシュ（疑似乱数）。
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(19.19, 73.31))) * 43758.5453123);
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

void main() {
  // 中央原点・アスペクト補正済みの座標系へ。
  vec2 p = vUv - 0.5;
  p.x *= uAspect;
  float absY = abs(p.y);

  // 進捗の中央で最大になる山なりの強度。
  float peak = pow(sin(clamp(uProgress, 0.0, 1.0) * 3.14159265), 0.72);

  // --- 柱の縦方向の成長 ---
  // reach: 柱が届いている高さ。uStretchY で 0.15 → 1.34 まで伸びる。
  float reach = mix(0.15, 1.34, uStretchY);
  float edgeSoftness = mix(0.07, 0.3, uStretchY); // 先端のぼかし幅
  float verticalMask = 1.0 - smoothstep(reach, reach + edgeSoftness, absY); // 柱の内側
  float centerSeed = 1.0 - smoothstep(0.0, 0.13, absY);                     // 中心の種火
  // 先端（reach の高さ）だけが光るガウシアン。柱の成長と一緒に動く。
  float movingTips = exp(-pow((absY - reach) / max(edgeSoftness, 0.001), 2.0));
  // 中心から先端へ向かうほど強くなる伸びの軌跡。
  float extensionTrace = smoothstep(0.0, reach, absY) * verticalMask;
  // プレーン上下端のフェード（画面端で切れて見えないように）。
  float softTopBottom = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);

  // --- 柱の中を流れるノイズ ---
  // 伸びるほど流速が上がり、ノイズの縦スケールも引き伸ばされる。
  float flowSpeed = mix(0.22, 1.18, uStretchY);
  float flow = noise(vec2(
    p.x * 16.0 + uDirection * uTime * 0.08,
    p.y * mix(42.0, 13.0, uStretchY) - uTime * flowSpeed * uDirection
  ));

  // ノイズによる横の揺らぎと、伸びに沿ったせん断で柱をたわませる。
  float bend = (flow - 0.5) * 0.1 * uDistortion * verticalMask;
  float shear = p.y * 0.06 * uDistortion * uDirection * extensionTrace;
  float distortedX = p.x + bend + shear;

  // --- 柱の断面（横方向の減衰） ---
  // axis: 鋭い中心の芯。halo: 広く淡い光。伸びるほど太くなる。
  float axis = exp(-abs(distortedX) * mix(18.0, 7.0, uStretchY));
  float halo = exp(-abs(distortedX) * mix(8.0, 2.6, uStretchY));
  float verticalGrain = smoothstep(0.48, 0.9, flow) * extensionTrace; // 流れの筋
  float coreColumn = axis * verticalMask;
  // 柱は中心の種火から成長し、uStretchY が 1 に近づくと全高に届く。
  float grownColumn = coreColumn * mix(centerSeed, 1.0, uStretchY);
  float tipGlow = axis * movingTips * (0.35 + uStretchY * 0.65); // 先端の輝き
  float sideTension = halo * verticalGrain * uStretchY;          // 脇の張力光
  float boundaryGate = uGravity * softTopBottom;                 // 全体ゲート

  // --- 配色: 真珠色の地に白い芯、張力部分に青の色収差 ---
  vec3 pearl = vec3(0.74, 0.82, 1.0);
  vec3 white = vec3(1.0, 0.98, 0.92);
  vec3 chromaBlue = vec3(0.22, 0.42, 1.0);
  vec3 col = mix(pearl, white, axis);
  col += chromaBlue * sideTension * peak * 0.16;
  col += vec3(1.0) * movingTips * peak * 0.12;
  col *= boundaryGate * uLightColumn * (
    grownColumn * 1.36 +
    tipGlow * 0.74 +
    sideTension * 0.34
  );

  // アルファは 0.68 で頭打ちにし、背後のシーンが完全には消えないようにする。
  float alpha = clamp(
    boundaryGate * (
      grownColumn * 0.6 +
      tipGlow * 0.42 +
      sideTension * 0.2
    ),
    0.0,
    0.68
  );
  gl_FragColor = vec4(col, alpha);
}
