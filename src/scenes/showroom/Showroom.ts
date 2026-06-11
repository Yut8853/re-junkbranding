import * as THREE from 'three';

import floorVert from './shaders/floor.vert.glsl?raw';
import floorFrag from './shaders/floor.frag.glsl?raw';
import gravityVert from './shaders/gravity.vert.glsl?raw';
import gravityFrag from './shaders/gravity.frag.glsl?raw';
import { WATER_PRESET, type WaterPreset } from './presets/waterPreset';
import { makeExhibitTexture, makeGlowTexture, type ExhibitTheme } from './textures';

const BG = 0x09070a;
const FAR_Z = -30;
const GRAVITY_EFFECT = {
  planeDistance: 3,
  ease: 0.18,
  progressEase: 0.14,
  cameraPull: 1.15,
  cameraLift: 0.34,
  exposureDip: 0.34,
} as const;

const EXHIBIT_VIDEO_SRC: Record<ExhibitTheme, string> = {
  toPlace: '/toplace.mp4',
  luzReal: '/luzreal.mp4',
  transB: '/trans.mp4',
};

const FULL_HD_ASPECT = 16 / 9;

const COMPOSITE_VERT = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const COMPOSITE_FRAG = /* glsl */ `
precision highp float;

uniform sampler2D tSceneA;
uniform sampler2D tSceneB;
uniform float uProgress;
uniform float uIntensity;
uniform float uTime;
uniform float uDirection;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform vec2 uResolution;

varying vec2 vUv;

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

vec3 blurScene(sampler2D tex, vec2 uv, vec2 axis, float amount) {
  vec3 color = vec3(0.0);
  float total = 0.0;

  for (int i = -4; i <= 4; i++) {
    float x = float(i);
    float weight = 1.0 - abs(x) / 5.0;
    color += texture2D(tex, uv + axis * x * amount).rgb * weight;
    total += weight;
  }

  return color / total;
}

vec2 distortedUv(vec2 uv, float side) {
  float warpedY = uv.y + (noise(vec2(uv.x * 2.4, uTime * 0.08)) - 0.5) * 0.08;
  float boundary = smoothstep(0.08, 0.64, warpedY) * (1.0 - smoothstep(0.68, 1.0, warpedY));
  float verticalBand = 1.0 - abs(uv.y - 0.5) * 2.0;
  verticalBand = pow(max(verticalBand, 0.0), 0.55);

  float n1 = noise(vec2(uv.x * 5.2, uv.y * 7.0 - uTime * 0.22));
  float n2 = noise(vec2(uv.x * 13.0 + uTime * 0.08, uv.y * 4.0));
  float combinedNoise = mix(n1, n2, 0.42) * 0.74 + verticalBand * 0.42;

  float stretchForce = uIntensity * 14.2 * combinedNoise * boundary;
  float stretch = exp(-stretchForce);
  float verticalShift = uIntensity * combinedNoise * 0.6 * side * uDirection;
  float mousePull = (uMouse.y * 0.5) * uIntensity * boundary;
  vec2 distorted = uv;
  distorted.y = (distorted.y - 0.5) * stretch + 0.5 - verticalShift - mousePull;
  distorted.x += (n1 - 0.5) * uIntensity * 0.04 * boundary;
  distorted.x += uMouseVelocity.x * uIntensity * 0.018 * boundary;

  return clamp(distorted, vec2(0.001), vec2(0.999));
}

float glitchStripe(vec2 uv, float intensity) {
  float row = floor(uv.y * 54.0);
  float rowNoise = hash(vec2(row, floor(uTime * 16.0)));
  float fineNoise = hash(vec2(row * 3.7, floor(uTime * 38.0)));
  float stripeOn = step(0.82 - intensity * 0.18, rowNoise);
  float band = 1.0 - smoothstep(0.0, 0.018, abs(fract(uv.y * 54.0) - 0.5));
  return stripeOn * band * fineNoise * intensity;
}

void main() {
  vec2 uv = vUv;
  vec2 texel = 1.0 / max(uResolution, vec2(1.0));
  float handoff = smoothstep(0.08, 0.92, uProgress);
  float intensity = smoothstep(0.0, 1.0, uIntensity);
  float peak = pow(sin(clamp(uProgress, 0.0, 1.0) * 3.14159265), 0.72);
  float split = intensity * (2.0 + peak * 5.8);
  float glitch = glitchStripe(uv, intensity * peak);
  float centerGlow = 1.0 - smoothstep(0.0, 0.84, distance(uv, vec2(0.5, 0.48)));
  vec3 radialBg = mix(vec3(0.025, 0.022, 0.026), vec3(0.82, 0.84, 0.88), pow(centerGlow, 1.55) * 0.42);

  vec2 uvA = distortedUv(uv, -1.0);
  vec2 uvB = distortedUv(uv, 1.0);
  uvA.x += (glitch - 0.5) * texel.x * 34.0 * intensity;
  uvB.x -= (glitch - 0.5) * texel.x * 42.0 * intensity;
  vec2 blurAxis = vec2(0.0, texel.y) * (4.0 + intensity * 18.0);

  vec4 sampleA = texture2D(tSceneA, uvA);
  vec4 sampleB = texture2D(tSceneB, uvB);
  vec3 colorA = mix(radialBg, blurScene(tSceneA, uvA, blurAxis, intensity * 0.76), sampleA.a);
  vec3 colorB = mix(radialBg, blurScene(tSceneB, uvB, blurAxis, intensity * 0.92), sampleB.a);

  vec2 glitchOffset = vec2((glitch * 18.0 + split) * texel.x, split * texel.y);
  colorA.r = texture2D(tSceneA, uvA + glitchOffset).r;
  colorA.g = texture2D(tSceneA, uvA + vec2(glitch * -10.0 * texel.x, 0.0)).g * (1.0 - glitch * 0.22);
  colorA.b = texture2D(tSceneA, uvA - glitchOffset).b;
  colorB.r = texture2D(tSceneB, uvB + vec2(glitchOffset.x, -glitchOffset.y)).r;
  colorB.g = texture2D(tSceneB, uvB + vec2(glitch * 8.0 * texel.x, 0.0)).g * (1.0 - glitch * 0.2);
  colorB.b = texture2D(tSceneB, uvB - vec2(glitchOffset.x, -glitchOffset.y)).b;

  float glowBandY = uv.y + (noise(vec2(uv.x * 3.6 + uTime * 0.06, 1.0)) - 0.5) * 0.16;
  float gravityGlow = 1.0 - abs(glowBandY - 0.5) * 2.0;
  gravityGlow = pow(max(gravityGlow, 0.0), 2.2) * intensity;
  vec3 mixed = mix(colorA, colorB, handoff);
  mixed = mix(radialBg, mixed, max(sampleA.a, sampleB.a));
  mixed += vec3(0.92, 0.94, 1.0) * pow(centerGlow, 2.4) * 0.08;
  mixed += vec3(0.88, 0.94, 1.0) * gravityGlow * 0.1;
  mixed += vec3(0.92, 0.98, 1.0) * glitch * 0.1;
  mixed += vec3(0.18, 0.36, 1.0) * glitch * 0.08;
  mixed.g *= 1.0 - glitch * 0.14;

  float grain = hash(uv * uResolution + uTime * 19.0) - 0.5;
  mixed += grain * 0.018 * intensity;

  gl_FragColor = vec4(mixed, 1.0);
}
`;

const EXHIBIT_VERT = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const EXHIBIT_FRAG = /* glsl */ `
precision highp float;

uniform sampler2D uMap;
uniform vec2 uImageSize;
uniform vec2 uFrameSize;
uniform vec3 uTint;
uniform float uImageScroll;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  float frameAspect = uFrameSize.x / max(uFrameSize.y, 0.0001);
  float imageAspect = uImageSize.x / max(uImageSize.y, 0.0001);
  vec2 scale = vec2(1.0);

  if (imageAspect > frameAspect) {
    scale.x = frameAspect / imageAspect;
  } else {
    scale.y = imageAspect / frameAspect;
  }

  vec2 covered = (uv - 0.5) * scale + 0.5;
  float verticalTravel = max(0.0, 1.0 - scale.y);
  covered.y += verticalTravel * (0.5 - clamp(uImageScroll, 0.0, 1.0));
  return clamp(covered, vec2(0.001), vec2(0.999));
}

void main() {
  vec2 uv = coverUv(vUv);
  vec4 texel = texture2D(uMap, uv);

  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float innerShadow = 1.0 - smoothstep(0.0, 0.13, edge) * 0.12;
  vec3 color = texel.rgb * uTint * innerShadow;

  gl_FragColor = vec4(color, 1.0);
}
`;

type WaterParams = {
  -readonly [K in keyof WaterPreset]: WaterPreset[K] extends boolean ? boolean : number;
};

type WaterColorParams = {
  base: string;
  shallow: string;
  crest: string;
  brightness: number;
};

type NightSeaEvent = {
  time: number;
  type: 'wavePulse' | 'sparkle';
  intensity: number;
};

type NightSeaTimeline = {
  durationSeconds: number;
  events: NightSeaEvent[];
};

export type GravityInput = {
  strength: number;
  progress: number;
  direction: 1 | -1;
};

function clamp01(v: number): number {
  return Math.min(Math.max(v, 0), 1);
}

function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function cloneDefaultWaterPreset(): WaterParams {
  return { ...WATER_PRESET };
}

function cloneDefaultWaterColors(): WaterColorParams {
  return {
    base: '#06384b',
    shallow: '#0f83a9',
    crest: '#bcefff',
    brightness: 1.38,
  };
}

function fullHdFrameSize(area: number): [number, number] {
  const width = Math.sqrt(area * FULL_HD_ASPECT);
  return [width, width / FULL_HD_ASPECT];
}

/**
 * Digital Showroom.
 *
 * A single, refined 3D gallery that the whole page lives inside. The visitor
 * stands at the front and — driven by page scroll — walks down a quiet path,
 * past two framed exhibits on the side walls, toward the far end of the
 * gallery. The space is the protagonist, not
 * a background: it persists behind Hero, Meaning and Issue, dimming as it goes.
 */
export class Showroom {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly clock = new THREE.Clock();

  private raf = 0;
  private readonly reduced: boolean;

  private readonly pointer = new THREE.Vector2(0, 0);
  private readonly pointerTarget = new THREE.Vector2(0, 0);
  private scroll = 0;
  private scrollEased = 0;

  private readonly camPos = new THREE.Vector3();
  private floorMat!: THREE.ShaderMaterial;
  private gravityMat!: THREE.ShaderMaterial;
  private gravityPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly sceneTargetA: THREE.WebGLRenderTarget;
  private readonly sceneTargetB: THREE.WebGLRenderTarget;
  private readonly compositeScene = new THREE.Scene();
  private readonly particleScene = new THREE.Scene();
  private readonly compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private compositeMat!: THREE.ShaderMaterial;
  private readonly savedCameraPosition = new THREE.Vector3();
  private readonly savedCameraQuaternion = new THREE.Quaternion();
  private motes!: THREE.Points;
  private moteBasePositions!: Float32Array;
  private moteSpeeds: number[] = [];
  private moteSeeds: number[] = [];
  private nightSeaEvents: NightSeaEvent[] = [];
  private nightSeaDuration = 24;
  private lastNightSeaTime: number | null = null;
  private sparklePulse = 0;
  private wavePulse = 0;
  private readonly exhibitVideos: HTMLVideoElement[] = [];
  private readonly disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];
  private readonly waterParams: WaterParams = cloneDefaultWaterPreset();
  private readonly waterColors: WaterColorParams = cloneDefaultWaterColors();
  private gravityTarget = 0;
  private gravity = 0;
  private gravityProgressTarget = 0;
  private gravityProgress = 0;
  private gravityDirection: 1 | -1 = 1;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(BG, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.sceneTargetA = this.makeRenderTarget();
    this.sceneTargetB = this.makeRenderTarget();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.026);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 240);
    this.camera.position.set(0, 1.7, 9);
    this.camPos.copy(this.camera.position);

    this.buildFloor();
    this.buildExhibits();
    this.buildGravityField();
    this.buildCompositePass();
    this.buildMotes();
    this.loadNightSeaTimeline();

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private track<T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(d: T): T {
    this.disposables.push(d);
    return d;
  }

  private makeRenderTarget(): THREE.WebGLRenderTarget {
    return new THREE.WebGLRenderTarget(1, 1, {
      depthBuffer: true,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
    });
  }

  private buildCompositePass(): void {
    this.compositeMat = new THREE.ShaderMaterial({
      vertexShader: COMPOSITE_VERT,
      fragmentShader: COMPOSITE_FRAG,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        tSceneA: { value: this.sceneTargetA.texture },
        tSceneB: { value: this.sceneTargetB.texture },
        uProgress: { value: 0 },
        uIntensity: { value: 0 },
        uTime: { value: 0 },
        uDirection: { value: 1 },
        uMouse: { value: new THREE.Vector2() },
        uMouseVelocity: { value: new THREE.Vector2() },
        uResolution: { value: new THREE.Vector2(1, 1) },
      },
    });
    this.track(this.compositeMat);

    const quad = new THREE.Mesh(this.track(new THREE.PlaneGeometry(2, 2)), this.compositeMat);
    this.compositeScene.add(quad);
  }

  private buildFloor(): void {
    this.floorMat = new THREE.ShaderMaterial({
      vertexShader: floorVert,
      fragmentShader: floorFrag,
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: 1 },
        uBase: { value: new THREE.Color(this.waterColors.base) },
        uShallow: { value: new THREE.Color(this.waterColors.shallow) },
        uCrest: { value: new THREE.Color(this.waterColors.crest) },
        uBrightness: { value: this.waterColors.brightness },
        uCamPos: { value: this.camPos },
        uWaveStrength: { value: this.waterParams.waveStrength },
        uWaveScale: { value: this.waterParams.waveScale },
        uWaveSpeed: { value: this.waterParams.waveSpeed },
        uRippleStrength: { value: this.waterParams.rippleStrength },
        uRippleScale: { value: this.waterParams.rippleScale },
        uRippleSpeed: { value: this.waterParams.rippleSpeed },
        uCrestSoftness: { value: this.waterParams.crestSoftness },
        uFogStrength: { value: this.waterParams.fogStrength },
        uHorizonFade: { value: this.waterParams.horizonFade },
        uVignetteStrength: { value: this.waterParams.vignetteStrength },
        uDepthDarkness: { value: this.waterParams.depthDarkness },
        uShowGuides: { value: Number(this.waterParams.showGuides) },
        uShowWaterOnly: { value: Number(this.waterParams.showWaterOnly) },
      },
    });
    this.track(this.floorMat);

    const geo = this.track(new THREE.PlaneGeometry(48, 120, 96, 240));
    const floor = new THREE.Mesh(geo, this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -28;
    this.scene.add(floor);
  }

  private buildGravityField(): void {
    this.gravityMat = new THREE.ShaderMaterial({
      vertexShader: gravityVert,
      fragmentShader: gravityFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGravity: { value: 0 },
        uProgress: { value: 0 },
        uStretchY: { value: 0 },
        uDistortion: { value: 0 },
        uLightColumn: { value: 0 },
        uDirection: { value: 1 },
        uAspect: { value: 1 },
      },
    });
    this.track(this.gravityMat);

    const geo = this.track(new THREE.PlaneGeometry(1, 1, 18, 42));
    this.gravityPlane = new THREE.Mesh(geo, this.gravityMat);
    this.gravityPlane.renderOrder = 20;
    this.scene.add(this.gravityPlane);
  }

  private textureSize(tex: THREE.Texture): THREE.Vector2 {
    const image = tex.image as { width?: number; height?: number } | undefined;
    return new THREE.Vector2(image?.width || 640, image?.height || 800);
  }

  private playExhibitVideo(video: HTMLVideoElement): void {
    const play = video.play();
    if (play) play.catch(() => undefined);
  }

  private makeExhibitVideo(theme: ExhibitTheme): HTMLVideoElement {
    const video = document.createElement('video');
    video.src = EXHIBIT_VIDEO_SRC[theme];
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.addEventListener('canplay', () => this.playExhibitVideo(video), { once: true });
    video.load();
    this.exhibitVideos.push(video);
    return video;
  }

  private makeExhibitPlateMaterial(theme: ExhibitTheme, size: [number, number]): THREE.ShaderMaterial {
    const placeholder = this.track(makeExhibitTexture(theme));
    placeholder.wrapS = THREE.ClampToEdgeWrapping;
    placeholder.wrapT = THREE.ClampToEdgeWrapping;

    const mat = this.track(
      new THREE.ShaderMaterial({
        vertexShader: EXHIBIT_VERT,
        fragmentShader: EXHIBIT_FRAG,
        uniforms: {
          uMap: { value: placeholder },
          uImageSize: { value: this.textureSize(placeholder) },
          uFrameSize: { value: new THREE.Vector2(size[0], size[1]) },
          uTint: { value: new THREE.Color(0xcfd0d6) },
          uImageScroll: { value: 0 },
        },
      }),
    );

    const video = this.makeExhibitVideo(theme);
    const videoTex = this.track(new THREE.VideoTexture(video));
    videoTex.colorSpace = THREE.SRGBColorSpace;
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;
    videoTex.wrapS = THREE.ClampToEdgeWrapping;
    videoTex.wrapT = THREE.ClampToEdgeWrapping;

    const applyVideoTexture = () => {
      mat.uniforms.uMap.value = videoTex;
      mat.uniforms.uImageSize.value.set(video.videoWidth || 1920, video.videoHeight || 1080);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      applyVideoTexture();
    } else {
      video.addEventListener('loadedmetadata', applyVideoTexture, { once: true });
    }

    return mat;
  }

  private exhibit(
    theme: ExhibitTheme,
    pos: [number, number, number],
    facing: 1 | -1,
    size: [number, number],
  ): void {
    const group = new THREE.Group();
    const [pw, ph] = size;

    // A thin, matte mount — a quiet margin around the work, not a chunky card.
    const frameMat = this.track(
      new THREE.MeshBasicMaterial({ color: 0x0c0d12, fog: true }),
    );
    const frame = new THREE.Mesh(
      this.track(new THREE.PlaneGeometry(pw + 0.16, ph + 0.16)),
      frameMat,
    );
    group.add(frame);

    // The work itself: an autoplaying website video, cropped inside a fixed frame.
    // The wall, frame and plane stay still while the video texture loops.
    const plateMat = this.makeExhibitPlateMaterial(theme, size);
    const plate = new THREE.Mesh(this.track(new THREE.PlaneGeometry(pw, ph)), plateMat);
    plate.position.z = 0.02;
    group.add(plate);

    // A soft spotlight wash above the work — it reads as deliberately lit, but
    // gently, so the photograph keeps its own tonal range.
    const spotTex = this.track(makeGlowTexture());
    const spotMat = this.track(
      new THREE.SpriteMaterial({
        map: spotTex,
        color: theme === 'luzReal' ? 0xdcecff : 0xf3f7ff,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: true,
      }),
    );
    const spot = new THREE.Sprite(spotMat);
    spot.scale.set(pw * 1.5, ph * 1.2, 1);
    spot.position.set(0, ph * 0.1, 0.05);
    group.add(spot);

    group.position.set(pos[0], pos[1], pos[2]);
    // Face the path, angled slightly toward the front so visitors approach it.
    group.rotation.y = facing * Math.PI * 0.5 - facing * 0.14;
    this.scene.add(group);
  }

  private buildExhibits(): void {
    // Three works placed with the same intent along the existing path.
    this.exhibit('toPlace', [6.6, 2.4, -7], -1, fullHdFrameSize(3.0 * 3.7));
    this.exhibit('luzReal', [-6.8, 3.0, -14], 1, fullHdFrameSize(3.4 * 4.6));
    this.exhibit('transB', [6.9, 2.7, -21], -1, fullHdFrameSize(3.1 * 4.0));
  }

  private buildMotes(): void {
    const count = 86;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0x8fd8ff),
      new THREE.Color(0xff9bd6),
      new THREE.Color(0xa7ffcf),
      new THREE.Color(0xb6a6ff),
      new THREE.Color(0xfff0a8),
    ];
    this.moteBasePositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = Math.pow(Math.random(), 0.72);
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius * 7.5;
      const y = 0.45 + Math.random() * 4.4;
      const z = -4 - Math.random() * 26;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      this.moteBasePositions[i * 3] = x;
      this.moteBasePositions[i * 3 + 1] = y;
      this.moteBasePositions[i * 3 + 2] = z;
      this.moteSpeeds.push(0.55 + Math.random() * 0.85);
      this.moteSeeds.push(Math.random() * Math.PI * 2);

      const color = palette[i % palette.length].clone();
      color.lerp(palette[(i * 3 + 2) % palette.length], Math.random() * 0.42);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geo = this.track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const glow = this.track(makeGlowTexture());
    const mat = this.track(
      new THREE.PointsMaterial({
        size: 0.18,
        map: glow,
        color: 0xffffff,
        vertexColors: true,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.motes = new THREE.Points(geo, mat);
    this.motes.renderOrder = 40;
    this.particleScene.add(this.motes);
  }

  private async loadNightSeaTimeline(): Promise<void> {
    try {
      const response = await fetch('/noctiluca_night_sea_events.json');
      if (!response.ok) return;
      const timeline = (await response.json()) as NightSeaTimeline;
      this.nightSeaDuration = Math.max(1, timeline.durationSeconds || 24);
      this.nightSeaEvents = [...(timeline.events ?? [])]
        .filter((event) => event.type === 'sparkle' || event.type === 'wavePulse')
        .sort((a, b) => a.time - b.time);
      this.lastNightSeaTime = null;
    } catch {
      this.nightSeaEvents = [];
    }
  }

  private triggerNightSeaEvent(event: NightSeaEvent): void {
    const amount = clamp01(event.intensity);
    if (event.type === 'sparkle') {
      this.sparklePulse = Math.min(1.35, this.sparklePulse + amount * 0.82);
      return;
    }

    this.wavePulse = Math.min(1.15, this.wavePulse + amount * 0.74);
  }

  private updateNightSeaTimeline(t: number): void {
    if (!this.nightSeaEvents.length) return;

    const loopTime = t % this.nightSeaDuration;
    if (this.lastNightSeaTime === null) {
      this.lastNightSeaTime = loopTime;
      return;
    }

    for (const event of this.nightSeaEvents) {
      const crossed = loopTime >= this.lastNightSeaTime
        ? event.time > this.lastNightSeaTime && event.time <= loopTime
        : event.time > this.lastNightSeaTime || event.time <= loopTime;

      if (crossed) this.triggerNightSeaEvent(event);
    }

    this.lastNightSeaTime = loopTime;
  }

  setPointer(x: number, y: number): void {
    this.pointerTarget.set(x, y);
  }

  /** Global page-scroll progress, 0 (front) .. 1 (deepest). */
  setScroll(progress: number): void {
    this.scroll = clamp01(progress);
  }

  setGravity(input: GravityInput): void {
    this.gravityTarget = Math.min(Math.max(input.strength, 0), 1.18);
    this.gravityProgressTarget = clamp01(input.progress);
    this.gravityDirection = input.direction;
  }

  private readonly resize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.sceneTargetA.setSize(w, h);
    this.sceneTargetB.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.gravityMat) this.gravityMat.uniforms.uAspect.value = this.camera.aspect;
    if (this.compositeMat) this.compositeMat.uniforms.uResolution.value.set(w, h);
  };

  private updateGravityPlane(): void {
    const distance = GRAVITY_EFFECT.planeDistance;
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) * 0.5) * distance;
    const width = height * this.camera.aspect;
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);

    this.gravityPlane.position.copy(this.camera.position).addScaledVector(forward, distance);
    this.gravityPlane.quaternion.copy(this.camera.quaternion);
    this.gravityPlane.scale.set(width, height, 1);
  }

  private renderSceneTarget(target: THREE.WebGLRenderTarget | null): void {
    this.updateGravityPlane();
    this.camPos.copy(this.camera.position);
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }

  private renderParticles(): void {
    const autoClear = this.renderer.autoClear;
    this.renderer.autoClear = false;
    this.renderer.clearDepth();
    this.renderer.render(this.particleScene, this.camera);
    this.renderer.autoClear = autoClear;
  }

  private readonly frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const t = this.clock.getElapsedTime();
    this.updateNightSeaTimeline(t);
    this.sparklePulse *= 0.9;
    this.wavePulse *= 0.94;

    // Ease scroll and pointer for weighted, premium motion.
    this.scrollEased += (this.scroll - this.scrollEased) * 0.07;
    this.gravity += (this.gravityTarget - this.gravity) * GRAVITY_EFFECT.ease;
    this.gravityProgress += (this.gravityProgressTarget - this.gravityProgress) * GRAVITY_EFFECT.progressEase;
    const ease = this.reduced ? 1 : 0.05;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease;

    const px = this.reduced ? 0 : this.pointer.x;
    const py = this.reduced ? 0 : this.pointer.y;
    const s = this.scrollEased;
    const gravityPeak = Math.pow(Math.sin(this.gravityProgress * Math.PI), 0.64);
    const gravityStretch = this.gravity * gravityPeak;

    // Walk into the showroom: dolly forward, passing the exhibits.
    const forward = this.waterParams.cameraForwardAmount;
    const targetZ = lerp(9, 9 + (-27 * forward), s) - gravityStretch * GRAVITY_EFFECT.cameraPull;
    const targetY = lerp(1.7, 1.45, s) + gravityStretch * GRAVITY_EFFECT.cameraLift;
    this.camera.position.x += (px * 1.1 * this.waterParams.parallaxStrength - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - py * 0.5 * this.waterParams.parallaxStrength - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(px * 0.7, 1.4 + py * 0.3, FAR_Z);
    this.camPos.copy(this.camera.position);

    // Brightness stays full through Hero, then settles for Meaning and sinks
    // further for Issue so the words read strongly without cutting the space.
    const exposure = (1 - 0.55 * smoothstep(0.3, 1, s))
      * (1 - gravityStretch * GRAVITY_EFFECT.exposureDip)
      + this.wavePulse * 0.09;

    this.floorMat.uniforms.uTime.value = t;
    this.floorMat.uniforms.uExposure.value = exposure;
    this.floorMat.uniforms.uWaveStrength.value = this.waterParams.waveStrength * (1 + this.wavePulse * 1.8);
    this.floorMat.uniforms.uRippleStrength.value = this.waterParams.rippleStrength + this.wavePulse * 0.034;
    this.floorMat.uniforms.uCrestSoftness.value = Math.max(0.38, this.waterParams.crestSoftness - this.wavePulse * 0.18);
    this.gravityMat.uniforms.uTime.value = t;
    this.gravityMat.uniforms.uGravity.value = this.reduced ? 0 : this.gravity;
    this.gravityMat.uniforms.uProgress.value = this.gravityProgress;
    this.gravityMat.uniforms.uStretchY.value = this.reduced ? 0 : gravityPeak;
    this.gravityMat.uniforms.uDistortion.value = this.reduced ? 0 : this.gravity * (0.12 + gravityPeak * 0.88);
    this.gravityMat.uniforms.uLightColumn.value = this.reduced ? 0 : this.gravity;
    this.gravityMat.uniforms.uDirection.value = this.gravityDirection;

    // Warm particles drift in the room, then gather toward the central pull.
    const attr = this.motes.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < this.moteSpeeds.length; i++) {
      const offset = i * 3;
      const seed = this.moteSeeds[i];
      const speed = this.moteSpeeds[i];
      const drift = t * speed + seed;
      const baseX = this.moteBasePositions[offset];
      const baseY = this.moteBasePositions[offset + 1];
      const baseZ = this.moteBasePositions[offset + 2];
      const sparkleLift = this.sparklePulse * (0.45 + 0.55 * Math.sin(seed * 3.7 + t * 5.4) * 0.5 + 0.5);
      const gather = Math.min(smoothstep(0.08, 0.82, gravityStretch) + sparkleLift * 0.1, 1);
      const swirlRadius = (1 - gather) * 0.9 + 0.42;
      const centerZ = this.camera.position.z - 3.4 - gravityStretch * 0.7;
      const centerY = this.camera.position.y + 0.06 + Math.sin(drift * 0.72) * 0.28 + sparkleLift * 0.18;
      const centerX = px * 0.34 + Math.cos(seed * 2.1) * 0.08;
      const idleX = baseX + Math.sin(drift * 0.62) * 0.32;
      const idleY = baseY + Math.sin(drift * 0.78) * 0.22;
      const idleZ = baseZ + Math.cos(drift * 0.38) * 0.44;
      const gatheredX = centerX + Math.cos(drift * 1.28) * swirlRadius;
      const gatheredY = centerY + Math.sin(drift * 1.08) * swirlRadius * 1.25;
      const gatheredZ = centerZ + Math.sin(seed + drift * 0.52) * 0.62;

      arr[offset] = lerp(idleX, gatheredX, gather);
      arr[offset + 1] = lerp(idleY, gatheredY, gather);
      arr[offset + 2] = lerp(idleZ, gatheredZ, gather);
    }
    attr.needsUpdate = true;
    const moteMat = this.motes.material as THREE.PointsMaterial;
    moteMat.opacity = 0.5 + this.sparklePulse * 0.44 + gravityStretch * 0.18;
    moteMat.size = 0.16 + this.sparklePulse * 0.09 + gravityStretch * 0.04;

    const compositeStrength = this.reduced ? 0 : gravityStretch;
    if (compositeStrength > 0.01) {
      this.savedCameraPosition.copy(this.camera.position);
      this.savedCameraQuaternion.copy(this.camera.quaternion);

      this.camera.position.y -= compositeStrength * 0.22;
      this.camera.position.z += compositeStrength * 0.86;
      this.camera.lookAt(px * 0.58, 1.34 + py * 0.22, FAR_Z);
      this.renderSceneTarget(this.sceneTargetA);

      this.camera.position.copy(this.savedCameraPosition);
      this.camera.quaternion.copy(this.savedCameraQuaternion);
      this.camera.position.y += compositeStrength * 0.18;
      this.camera.position.z -= compositeStrength * 0.58;
      this.camera.lookAt(px * 0.78, 1.46 + py * 0.36, FAR_Z);
      this.renderSceneTarget(this.sceneTargetB);

      this.camera.position.copy(this.savedCameraPosition);
      this.camera.quaternion.copy(this.savedCameraQuaternion);
      this.updateGravityPlane();
      this.camPos.copy(this.camera.position);

      this.compositeMat.uniforms.uProgress.value = this.gravityProgress;
      this.compositeMat.uniforms.uIntensity.value = Math.min(compositeStrength * 1.18 + this.wavePulse * 0.16, 1);
      this.compositeMat.uniforms.uTime.value = t;
      this.compositeMat.uniforms.uDirection.value = this.gravityDirection;
      this.compositeMat.uniforms.uMouse.value.set(px, py);
      this.compositeMat.uniforms.uMouseVelocity.value
        .copy(this.pointerTarget)
        .sub(this.pointer)
        .multiplyScalar(0.5);

      this.renderer.setRenderTarget(null);
      this.renderer.render(this.compositeScene, this.compositeCamera);
      this.renderParticles();
    } else {
      this.renderSceneTarget(null);
      this.renderParticles();
    }
  };

  start(): void {
    if (this.raf) return;
    if (this.disposed) return;
    this.clock.start();
    for (const video of this.exhibitVideos) this.playExhibitVideo(video);
    this.frame();
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    for (const video of this.exhibitVideos) video.pause();
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    window.removeEventListener('resize', this.resize);
    for (const video of this.exhibitVideos) {
      video.removeAttribute('src');
      video.load();
    }
    for (const d of this.disposables) d.dispose();
    this.sceneTargetA.dispose();
    this.sceneTargetB.dispose();
    this.renderer.dispose();
  }
}
