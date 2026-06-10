// Showroom ocean — a low, dark water plane for the gallery path.
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;

uniform float uTime;
uniform float uWaveStrength;
uniform float uWaveScale;
uniform float uWaveSpeed;
uniform float uRippleStrength;
uniform float uRippleScale;
uniform float uRippleSpeed;

float waveHeight(vec2 p) {
  float t = uTime;
  float waveScale = uWaveScale * 0.023;
  float rippleScale = uRippleScale * 0.02;
  float h = 0.0;
  h += sin(p.x * waveScale + p.y * waveScale * 0.26 + t * uWaveSpeed * 3.27) * uWaveStrength * 1.38;
  h += sin(p.x * -waveScale * 0.66 + p.y * waveScale * 0.79 + t * uWaveSpeed * 2.18) * uWaveStrength;
  h += sin(p.x * rippleScale + p.y * -rippleScale * 0.19 + t * uRippleSpeed * 8.75) * uRippleStrength * 0.88;
  h += sin((p.x + p.y) * rippleScale * 1.4 + t * uRippleSpeed * 11.5) * uRippleStrength * 0.45;
  return h;
}

void main() {
  vUv = uv;
  vec3 p = position;
  p.z += waveHeight(p.xy);

  float eps = 0.22;
  float hx = waveHeight(p.xy + vec2(eps, 0.0)) - waveHeight(p.xy - vec2(eps, 0.0));
  float hy = waveHeight(p.xy + vec2(0.0, eps)) - waveHeight(p.xy - vec2(0.0, eps));
  vec3 localNormal = normalize(vec3(-hx, -hy, eps * 2.0));

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(normalMatrix * localNormal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
