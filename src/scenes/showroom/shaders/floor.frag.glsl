// Showroom ocean — dark water that carries the eye toward the aperture.
precision highp float;

varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;

uniform float uTime;
uniform float uExposure;  // global brightness (dims through Meaning / Issue)
uniform float uOpen;      // back light opening 0 -> 1
uniform vec3 uBase;       // deepest water colour
uniform vec3 uGlow;       // colour cast by the far light
uniform vec3 uAperture;   // world position of the far light
uniform vec3 uCamPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float waveLine(vec2 p, float scale, float speed, float width) {
  float n = noise(p * scale + vec2(uTime * speed, -uTime * speed * 0.37));
  float crest = abs(fract(p.y * scale * 0.18 + n * 0.28 + uTime * speed) - 0.5);
  return 1.0 - smoothstep(width, width + 0.035, crest);
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(uCamPos - vWorld);
  vec3 toLight = normalize(uAperture - vWorld);

  float dLight = length(vWorld.xz - uAperture.xz);
  float pool = exp(-dLight * 0.07) * (0.55 + 0.45 * uOpen);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);
  float spec = pow(max(dot(reflect(-toLight, n), viewDir), 0.0), 42.0);

  vec3 deep = uBase;
  vec3 shallow = vec3(0.025, 0.055, 0.075);
  vec3 col = mix(deep, shallow, 0.35 + fresnel * 0.55);

  // Long, low crests: enough motion to read as ocean, subdued enough for copy.
  float crests = waveLine(vWorld.xz, 0.88, 0.035, 0.055);
  crests += waveLine(vWorld.xz + vec2(12.0, -4.0), 1.55, -0.022, 0.034) * 0.45;
  crests *= smoothstep(8.0, 2.0, abs(vWorld.x));
  crests *= smoothstep(42.0, 4.0, length(vWorld - uCamPos));

  col += uGlow * pool * 0.22;
  col += uGlow * spec * (0.35 + 0.65 * uOpen);
  col += vec3(0.55, 0.72, 0.82) * crests * 0.075;
  col += uGlow * fresnel * pool * 0.2;

  // Keep the gallery edges dark so the exhibits and Hero copy stay dominant.
  float sideFalloff = smoothstep(11.5, 1.5, abs(vWorld.x));
  float dCam = length(vWorld - uCamPos);
  float distanceFade = smoothstep(78.0, 4.0, dCam);
  float vignette = mix(0.38, 1.0, sideFalloff);
  col *= vignette * distanceFade * uExposure;

  gl_FragColor = vec4(col, 1.0);
}
