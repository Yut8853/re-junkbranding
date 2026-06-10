// Showroom floor — a refined, dark gallery floor with a guideline path that
// leads the eye toward the opening light at the far end. Depth comes from the
// path, a soft light pool and fog — not from particles or bloom.
precision highp float;

varying vec2 vUv;
varying vec3 vWorld;

uniform float uTime;
uniform float uExposure;  // global brightness (dims through Meaning / Issue)
uniform float uOpen;      // back light opening 0 -> 1
uniform vec3 uBase;       // floor base colour
uniform vec3 uGlow;       // colour cast by the far light
uniform vec3 uAperture;   // world position of the far light
uniform vec3 uCamPos;

// Anti-aliased line mask around a target coordinate.
float lineMask(float coord, float target, float halfWidth) {
  float d = abs(coord - target);
  float aa = fwidth(coord) * 1.2;
  return 1.0 - smoothstep(halfWidth, halfWidth + aa, d);
}

void main() {
  vec3 col = uBase;

  // Distance from the far light: a soft pool of light spreads across the floor.
  float dLight = length(vWorld.xz - uAperture.xz);
  float pool = exp(-dLight * 0.085) * (0.6 + 0.4 * uOpen);

  // Central guideline running down the room toward the light (the "path in").
  float center = lineMask(vWorld.x, 0.0, 0.045);
  // Two faint rails framing the walking path.
  float rails = lineMask(abs(vWorld.x), 3.4, 0.03) * 0.5;

  // Perpendicular floor markers every few metres (gallery rhythm).
  float zc = vWorld.z;
  float ticks = lineMask(fract(zc * 0.18 + 0.5) - 0.5, 0.0, 0.02);
  // Markers only read within the walking path width.
  ticks *= smoothstep(4.2, 3.2, abs(vWorld.x));

  float guides = clamp(center + rails + ticks * 0.6, 0.0, 1.0);

  // The guideline brightens as it approaches the light.
  float guideGlow = mix(0.18, 1.0, pool);
  col += uGlow * guides * guideGlow * 0.9;

  // Light pool wash on the floor.
  col += uGlow * pool * 0.5;

  // Very slow shimmer so the floor feels material, never static, never flashy.
  float shimmer = 0.97 + 0.03 * sin(uTime * 0.5 + vWorld.z * 0.4);
  col *= shimmer;

  // Distance fade toward the camera horizon (pairs with scene fog).
  float dCam = length(vWorld - uCamPos);
  float fade = smoothstep(70.0, 3.0, dCam);

  col *= fade * uExposure;

  gl_FragColor = vec4(col, 1.0);
}
