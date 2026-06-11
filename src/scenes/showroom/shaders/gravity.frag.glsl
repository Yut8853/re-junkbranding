precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uGravity;
uniform float uProgress;
uniform float uStretchY;
uniform float uDistortion;
uniform float uLightColumn;
uniform float uDirection;
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
  float absY = abs(p.y);

  float peak = pow(sin(clamp(uProgress, 0.0, 1.0) * 3.14159265), 0.72);
  float reach = mix(0.15, 1.34, uStretchY);
  float edgeSoftness = mix(0.07, 0.3, uStretchY);
  float verticalMask = 1.0 - smoothstep(reach, reach + edgeSoftness, absY);
  float centerSeed = 1.0 - smoothstep(0.0, 0.13, absY);
  float movingTips = exp(-pow((absY - reach) / max(edgeSoftness, 0.001), 2.0));
  float extensionTrace = smoothstep(0.0, reach, absY) * verticalMask;
  float softTopBottom = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);

  float flowSpeed = mix(0.22, 1.18, uStretchY);
  float flow = noise(vec2(
    p.x * 16.0 + uDirection * uTime * 0.08,
    p.y * mix(42.0, 13.0, uStretchY) - uTime * flowSpeed * uDirection
  ));

  float bend = (flow - 0.5) * 0.1 * uDistortion * verticalMask;
  float shear = p.y * 0.06 * uDistortion * uDirection * extensionTrace;
  float distortedX = p.x + bend + shear;

  float axis = exp(-abs(distortedX) * mix(18.0, 7.0, uStretchY));
  float halo = exp(-abs(distortedX) * mix(8.0, 2.6, uStretchY));
  float verticalGrain = smoothstep(0.48, 0.9, flow) * extensionTrace;
  float coreColumn = axis * verticalMask;
  float grownColumn = coreColumn * mix(centerSeed, 1.0, uStretchY);
  float tipGlow = axis * movingTips * (0.35 + uStretchY * 0.65);
  float sideTension = halo * verticalGrain * uStretchY;
  float boundaryGate = uGravity * softTopBottom;

  vec3 pearl = vec3(0.74, 0.82, 1.0);
  vec3 white = vec3(1.0, 0.98, 0.92);
  vec3 chromaBlue = vec3(0.22, 0.42, 1.0);
  vec3 col = mix(pearl, white, axis);
  col += chromaBlue * sideTension * peak * 0.16;
  col += vec3(1.0) * movingTips * peak * 0.12;
  col *= boundaryGate * uLightColumn * (
    grownColumn * 1.36 +
    tipGlow * 0.74 +
    sideTension * 0.34
  );

  float alpha = clamp(
    boundaryGate * (
      grownColumn * 0.6 +
      tipGlow * 0.42 +
      sideTension * 0.2
    ),
    0.0,
    0.68
  );
  gl_FragColor = vec4(col, alpha);
}
