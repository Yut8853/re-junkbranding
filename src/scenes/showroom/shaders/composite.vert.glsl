// 合成パス 頂点シェーダー: 画面いっぱいのクアッドをそのまま出力する。
// 正射影カメラ前提なので射影行列を通さず position.xy を直接使う。
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
