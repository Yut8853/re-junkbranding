varying vec2 vUv;

uniform float uProgress;
uniform float uStretchY;
uniform float uDistortion;
uniform float uDirection;

void main() {
  vUv = uv;
  vec3 pos = position;
  vec2 p = uv - 0.5;
  float axis = 1.0 - smoothstep(0.03, 0.42, abs(p.x));
  float verticalPull = axis * uStretchY;

  pos.y *= 1.0 + verticalPull * 0.08;
  pos.x += p.y * verticalPull * 0.045 * uDirection;
  pos.z += axis * uDistortion * 0.035;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
