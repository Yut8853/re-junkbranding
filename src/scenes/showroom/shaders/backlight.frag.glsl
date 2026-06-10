// The far end of the showroom — not a glowing board, but an ENTRANCE:
// a tall opening that leads out of the room into the brand's world. The
// centre recedes into bright depth, the vertical jambs catch light, and a
// threshold of light spills onto the floor at its base. As the visitor moves
// in (uOpen 0 -> 1) the opening widens and the way through becomes clear.
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uOpen;     // 0 = a slit, 1 = an open doorway
uniform float uExposure; // global brightness
uniform vec3 uWarm;
uniform vec3 uCool;

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
  float cx = abs(uv.x - 0.5);

  // The opening half-width grows as we enter.
  float halfW = mix(0.1, 0.28, uOpen);

  // Inside the opening: bright depth that recedes (brighter toward the centre).
  float inside = smoothstep(halfW, halfW * 0.2, cx);

  // Vertical jambs: thin bright edges framing the opening (the door sides).
  float jamb = smoothstep(0.02, 0.0, abs(cx - halfW));

  // Vertical profile: a doorway standing on the floor.
  float floorRise = smoothstep(0.0, 0.12, uv.y);   // bright at the threshold
  float topFade = smoothstep(1.0, 0.4, uv.y);      // dissolves toward the top
  float vert = floorRise * topFade;

  // Threshold: a band of light pooling at the base, spilling forward.
  float threshold = smoothstep(0.16, 0.0, uv.y) * inside;

  // Gentle movement in the depth beyond — air, not a flat panel.
  float vol = 0.75 + 0.4 * noise(vec2(uv.x * 4.0, uv.y * 2.6 - uTime * 0.05));

  // Compose: interior depth + jambs + threshold spill.
  float core = inside * vert * vol;
  core += jamb * topFade * 0.7;
  core += threshold * 1.1;
  core = clamp(core, 0.0, 1.0);

  // Warm threshold and depth, cooler high edges.
  vec3 col = mix(uCool, uWarm, clamp(inside * vert + threshold, 0.0, 1.0));

  // The way through is only fully revealed as it opens.
  float reveal = 0.45 + 0.55 * uOpen;
  float alpha = core * reveal;

  gl_FragColor = vec4(col * (0.5 + 0.9 * core) * uExposure, alpha);
}
