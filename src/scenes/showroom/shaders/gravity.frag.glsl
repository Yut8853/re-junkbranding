precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uStrength;
uniform float uAspect;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(19.19, 73.31))) * 43758.5453123);
}

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
  vec2 p = vUv - 0.5;
  p.x *= uAspect;

  float pull = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
  float axis = exp(-abs(p.x) * 5.2);
  float wideField = exp(-abs(p.x) * 1.55);
  float stretch = pow(abs(p.y) * 2.0, 1.08);
  float vertical = smoothstep(0.02, 0.92, stretch);
  float ripple = noise(vec2(p.x * 10.0, p.y * 24.0 - uTime * 0.9));
  float striation = smoothstep(0.42, 0.9, ripple) * wideField;

  float core = axis * (0.42 + vertical * 0.95);
  float field = (core + striation * 0.46) * pull * uStrength;
  float compression = smoothstep(0.28, 0.0, abs(p.y)) * wideField * uStrength;

  vec3 cool = vec3(0.32, 0.56, 0.78);
  vec3 warm = vec3(0.82, 0.68, 0.48);
  vec3 col = mix(cool, warm, smoothstep(0.0, 0.55, abs(p.y)));
  col *= field * 1.45 + compression * 0.56;

  float alpha = clamp(field * 1.08 + compression * 0.52, 0.0, 0.86);
  gl_FragColor = vec4(col, alpha);
}
