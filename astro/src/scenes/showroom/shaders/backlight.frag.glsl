// The far light — a soft doorway of warm light at the end of the showroom.
// It is the destination: "the place where you enter the brand's world".
// As the visitor scrolls in (uOpen 0 -> 1) the doorway widens and warms.
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uOpen;     // 0 = a slit of light, 1 = an open doorway
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

  // Horizontal width of the doorway grows as it opens.
  float width = mix(0.16, 0.5, uOpen);
  float cx = abs(uv.x - 0.5);
  float horiz = smoothstep(width, 0.0, cx);
  horiz = pow(horiz, 1.5);

  // Vertical: a doorway standing on the floor, brightest low, soft at the top.
  float floorRise = smoothstep(0.0, 0.18, uv.y);
  float topFade = smoothstep(1.0, 0.45, uv.y);
  float vert = floorRise * topFade;

  // Gentle internal movement — light breathing in the opening.
  float vol = noise(vec2(uv.x * 4.0, uv.y * 3.0 - uTime * 0.06));
  vol = 0.7 + 0.5 * vol;

  float core = horiz * (0.35 + 0.65 * vert) * vol;
  core = clamp(core, 0.0, 1.0);

  // Warm core, cooler halo; warms further as it opens.
  vec3 col = mix(uCool, uWarm, horiz * vert * (0.5 + 0.5 * uOpen));

  float alpha = core * (0.5 + 0.5 * uOpen);

  gl_FragColor = vec4(col * (0.5 + 0.9 * core) * uExposure, alpha);
}
