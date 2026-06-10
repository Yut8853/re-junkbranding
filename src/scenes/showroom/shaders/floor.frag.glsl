// Showroom ocean — dark water for the gallery path.
precision highp float;

varying vec2 vUv;
varying vec3 vWorld;
varying vec3 vNormal;

uniform float uTime;
uniform float uExposure;  // global brightness (dims through Meaning / Issue)
uniform vec3 uBase;       // deepest water colour
uniform vec3 uCamPos;
uniform float uWaveStrength;
uniform float uWaveScale;
uniform float uWaveSpeed;
uniform float uRippleStrength;
uniform float uRippleScale;
uniform float uRippleSpeed;
uniform float uCrestSoftness;
uniform float uFogStrength;
uniform float uHorizonFade;
uniform float uVignetteStrength;
uniform float uDepthDarkness;
uniform float uShowGuides;
uniform float uShowWaterOnly;

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
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

  vec3 deep = uBase;
  vec3 shallow = vec3(0.025, 0.055, 0.075);
  vec3 col = mix(deep, shallow, 0.35 + fresnel * 0.55);
  col *= mix(1.0, 0.48, clamp(uDepthDarkness, 0.0, 1.0));

  // Long, low crests: enough motion to read as ocean, subdued enough for copy.
  float waveScale = uWaveScale * 0.049;
  float rippleScale = uRippleScale * 0.032;
  float crests = waveLine(vWorld.xz, waveScale, uWaveSpeed * 0.16, mix(0.09, 0.018, uCrestSoftness));
  crests += waveLine(vWorld.xz + vec2(12.0, -4.0), rippleScale, -uRippleSpeed * 0.18, 0.034) * 0.45;
  crests *= smoothstep(8.0, 2.0, abs(vWorld.x));
  crests *= smoothstep(42.0, 4.0, length(vWorld - uCamPos));
  crests *= uWaveStrength * 8.0 + uRippleStrength * 5.0;

  col += vec3(0.55, 0.72, 0.82) * crests * 0.075;
  col += vec3(0.018, 0.03, 0.04) * fresnel * 0.16;

  // Keep the gallery edges dark so the exhibits and Hero copy stay dominant.
  float sideFalloff = smoothstep(11.5, 1.5, abs(vWorld.x));
  float dCam = length(vWorld - uCamPos);
  float distanceFade = mix(1.0, smoothstep(78.0, 4.0, dCam), uHorizonFade);
  float vignette = mix(1.0 - uVignetteStrength, 1.0, sideFalloff);
  col *= vignette * distanceFade * mix(1.0, uExposure, uFogStrength);

  if (uShowWaterOnly > 0.5) {
    col = mix(deep, shallow, 0.5) + vec3(crests * 0.12);
  }

  if (uShowGuides > 0.5) {
    float centerLine = 1.0 - smoothstep(0.0, 0.06, abs(vWorld.x));
    col = mix(col, vec3(0.1, 0.75, 1.0), centerLine * 0.35);
  }

  gl_FragColor = vec4(col, 1.0);
}
