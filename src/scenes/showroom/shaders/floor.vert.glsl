// Showroom ocean — a low, dark water plane for the gallery path.
varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;

uniform float uTime;

float waveHeight(vec2 p) {
  float t = uTime;
  float h = 0.0;
  h += sin(p.x * 0.42 + p.y * 0.11 + t * 0.72) * 0.11;
  h += sin(p.x * -0.28 + p.y * 0.33 + t * 0.48) * 0.08;
  h += sin(p.x * 0.95 + p.y * -0.18 + t * 1.05) * 0.035;
  h += sin((p.x + p.y) * 1.35 + t * 1.38) * 0.018;
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
