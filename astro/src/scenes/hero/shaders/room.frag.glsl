// Room surface — one warm light source (the aperture) glows across the space.
// No particles, no postprocessing bloom: depth comes from a single light + fog.
precision highp float;

varying vec2 vUv;
varying vec3 vWorld;

uniform float uTime;
uniform vec3 uBase;     // deep base colour of the room
uniform vec3 uGlow;     // colour cast by the aperture light
uniform vec3 uAperture; // world-space position of the light
uniform vec3 uCamPos;   // camera position (for distance fade)

// Faint architectural grid that fades with distance — texture, not a "tron" grid.
float fineGrid(vec2 p) {
  vec2 g = abs(fract(p * 0.5 - 0.5) - 0.5) / fwidth(p * 0.5);
  float line = min(g.x, g.y);
  return 1.0 - min(line, 1.0);
}

void main() {
  // Distance fade away from the camera (works with scene fog for depth).
  float dCam = length(vWorld - uCamPos);
  float fade = smoothstep(60.0, 4.0, dCam);

  // Single light source: brightness falls off with distance from the aperture.
  float dLight = length(vWorld - uAperture);
  float glow = exp(-dLight * 0.14);

  // Slow, calm breathing so the space feels alive but never flashy.
  float breath = 0.92 + 0.08 * sin(uTime * 0.4 + vWorld.z * 0.18);

  vec3 col = uBase;
  col += uGlow * glow * breath;

  // Subtle grid, only readable near the light, kept very low.
  float grid = fineGrid(vWorld.xz + vWorld.xy);
  col += grid * glow * 0.04;

  col *= fade;

  gl_FragColor = vec4(col, 1.0);
}
