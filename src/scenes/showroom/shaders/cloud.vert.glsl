// 雲 頂点シェーダー: UV をフラグメントへ渡すだけの素通し。
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
