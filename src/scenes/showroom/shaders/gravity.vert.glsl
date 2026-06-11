// ============================================================
// 重力フィールド 頂点シェーダー
// 画面中央の縦軸付近の頂点だけを縦に引き伸ばし、
// 「光の柱が伸びていく」物理的な変形を加える。
// ============================================================
varying vec2 vUv;

uniform float uProgress;   // 遷移進捗（未使用だが将来の調整用に保持）
uniform float uStretchY;   // 縦伸びの強さ 0..1
uniform float uDistortion; // 歪み量
uniform float uDirection;  // スクロール方向 (+1 / -1)

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 p = uv - 0.5;

  // 中央の縦軸に近い頂点ほど 1 になるマスク。
  float axis = 1.0 - smoothstep(0.03, 0.42, abs(p.x));
  float verticalPull = axis * uStretchY;

  pos.y *= 1.0 + verticalPull * 0.24;                 // 柱を縦に伸ばす
  pos.x += p.y * verticalPull * 0.078 * uDirection;   // 方向に応じた斜めのせん断
  pos.z += axis * uDistortion * 0.064;                // 軸付近をわずかに手前へ

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
