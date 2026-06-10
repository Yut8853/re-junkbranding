// Aperture — a single luminous volume rising from the floor.
// This is the brand world "standing up" beyond the screen: a soft column of
// light with slow internal movement. It is the only strong light in the scene.
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec3 uWarm; // warm core
uniform vec3 uCool; // cool outer light

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453);
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
  vec2 uv = vUv;

  // Rounded horizontal falloff — soft column, not a hard panel edge.
  float cx = abs(uv.x - 0.5) * 2.0;
  float horiz = pow(smoothstep(1.0, 0.0, cx), 1.6);

  // Vertical: emerges from the floor, swells, then dissolves toward the top.
  float rise = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.5, uv.y);

  // Slow drifting internal light — the world breathing.
  float n1 = noise(vec2(uv.x * 3.0, uv.y * 2.2 - uTime * 0.07));
  float n2 = noise(vec2(uv.x * 6.0 + 11.0, uv.y * 4.0 - uTime * 0.045));
  float vol = mix(n1, n2, 0.5);

  float core = horiz * (0.3 + rise);
  core *= 0.65 + 0.7 * vol;
  core = clamp(core, 0.0, 1.0);

  // Warm at the centre, cooling toward the edges and top.
  vec3 col = mix(uCool, uWarm, horiz * rise);

  // Soft alpha so it bleeds into the room rather than reading as a flat board.
  float alpha = core * smoothstep(0.0, 0.16, uv.y);

  gl_FragColor = vec4(col * (0.55 + 0.85 * alpha), alpha * 0.9);
}
