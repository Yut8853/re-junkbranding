// グリッチオーバーレイ 頂点シェーダー:
// クリップ空間の頂点 (-1..1) をそのまま出力し、UV (0..1) に変換して渡す。
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
