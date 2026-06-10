import * as THREE from 'three';

import floorVert from './shaders/floor.vert.glsl?raw';
import floorFrag from './shaders/floor.frag.glsl?raw';
import backlightVert from './shaders/backlight.vert.glsl?raw';
import backlightFrag from './shaders/backlight.frag.glsl?raw';
import { loadExhibitTexture, makeGlowTexture, type ExhibitTheme } from './textures';

const BG = 0x05060a;
const APERTURE = new THREE.Vector3(0, 4.2, -30);

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

/**
 * Digital Showroom.
 *
 * A single, refined 3D gallery that the whole page lives inside. The visitor
 * stands at the entrance and — driven by page scroll — walks down a lit path,
 * past two framed exhibits on the side walls, toward an opening doorway of
 * light at the far end (the brand's world). The space is the protagonist, not
 * a background: it persists behind Hero, Meaning and Issue, dimming as it goes.
 */
export class Showroom {
  private readonly canvas: HTMLCanvasElement;
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
  private backlightMat!: THREE.ShaderMaterial;
  private motes!: THREE.Points;
  private moteSpeeds: number[] = [];
  private readonly disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(BG, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(BG, 0.026);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 240);
    this.camera.position.set(0, 1.7, 9);
    this.camPos.copy(this.camera.position);

    this.buildFloor();
    this.buildExhibits();
    this.buildBackLight();
    this.buildMotes();

    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private track<T extends THREE.BufferGeometry | THREE.Material | THREE.Texture>(d: T): T {
    this.disposables.push(d);
    return d;
  }

  private buildFloor(): void {
    this.floorMat = new THREE.ShaderMaterial({
      vertexShader: floorVert,
      fragmentShader: floorFrag,
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: 1 },
        uOpen: { value: 0 },
        uBase: { value: new THREE.Color(0x03090e) },
        uGlow: { value: new THREE.Color(0x7f9fc2) },
        uAperture: { value: APERTURE.clone() },
        uCamPos: { value: this.camPos },
      },
    });
    this.track(this.floorMat);

    const geo = this.track(new THREE.PlaneGeometry(48, 120, 96, 240));
    const floor = new THREE.Mesh(geo, this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -28;
    this.scene.add(floor);
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

    // The work itself: a photograph hung on the wall. Loads from
    // public/exhibits/<theme>.webp; until then a painted placeholder stands in.
    // color slightly below white keeps the print from glowing in the dim room.
    const plateMat = this.track(
      new THREE.MeshBasicMaterial({ color: 0xcfd0d6, fog: true }),
    );
    plateMat.map = this.track(
      loadExhibitTexture(theme, (tex) => {
        this.track(tex);
        plateMat.map = tex;
        plateMat.needsUpdate = true;
      }),
    );
    const plate = new THREE.Mesh(this.track(new THREE.PlaneGeometry(pw, ph)), plateMat);
    plate.position.z = 0.02;
    group.add(plate);

    // A soft spotlight wash above the work — it reads as deliberately lit, but
    // gently, so the photograph keeps its own tonal range.
    const spotTex = this.track(makeGlowTexture());
    const spotMat = this.track(
      new THREE.SpriteMaterial({
        map: spotTex,
        color: theme === 'space' ? 0xbcd2f0 : 0xffe7c4,
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
    // Face the path, angled slightly toward the entrance so visitors approach it.
    group.rotation.y = facing * Math.PI * 0.5 - facing * 0.14;
    this.scene.add(group);
  }

  private buildExhibits(): void {
    // Three works, each a kind of value, placed with intent along the path:
    //   Craft — closest and intimate (small, low, warm): the making.
    //   Space — mid, taller and airier: the atmosphere of a place.
    //   Trust — deepest, near the light, calm and centred: the relationship.
    this.exhibit('craft', [6.6, 2.4, -7], -1, [3.0, 3.7]);
    this.exhibit('space', [-6.8, 3.0, -14], 1, [3.4, 4.6]);
    this.exhibit('trust', [6.9, 2.7, -21], -1, [3.1, 4.0]);
  }

  private buildBackLight(): void {
    this.backlightMat = new THREE.ShaderMaterial({
      vertexShader: backlightVert,
      fragmentShader: backlightFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uOpen: { value: 0 },
        uExposure: { value: 1 },
        uWarm: { value: new THREE.Color(0xffd6a0) },
        uCool: { value: new THREE.Color(0x9fb6e0) },
      },
    });
    this.track(this.backlightMat);

    // Tall and narrow, standing on the floor — a doorway, not a panel.
    const geo = this.track(new THREE.PlaneGeometry(7.5, 12));
    const light = new THREE.Mesh(geo, this.backlightMat);
    light.position.set(APERTURE.x, 5.4, APERTURE.z);
    this.scene.add(light);
  }

  private buildMotes(): void {
    const count = 14;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4 + 0.3;
      positions[i * 3 + 2] = -6 - Math.random() * 20;
      this.moteSpeeds.push(0.05 + Math.random() * 0.12);
    }
    const geo = this.track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const glow = this.track(makeGlowTexture());
    const mat = this.track(
      new THREE.PointsMaterial({
        size: 0.16,
        map: glow,
        color: 0xfff0d8,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    );
    this.motes = new THREE.Points(geo, mat);
    this.scene.add(this.motes);
  }

  setPointer(x: number, y: number): void {
    this.pointerTarget.set(x, y);
  }

  /** Global page-scroll progress, 0 (entrance) .. 1 (deepest, before the light). */
  setScroll(progress: number): void {
    this.scroll = clamp01(progress);
  }

  private readonly resize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private readonly frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const t = this.clock.getElapsedTime();

    // Ease scroll and pointer for weighted, premium motion.
    this.scrollEased += (this.scroll - this.scrollEased) * 0.07;
    const ease = this.reduced ? 1 : 0.05;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease;

    const px = this.reduced ? 0 : this.pointer.x;
    const py = this.reduced ? 0 : this.pointer.y;
    const s = this.scrollEased;

    // Walk into the showroom: dolly forward, passing the exhibits.
    const targetZ = lerp(9, -18, s);
    const targetY = lerp(1.7, 1.45, s);
    this.camera.position.x += (px * 1.1 - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - py * 0.5 - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(px * 0.7, 1.4 + py * 0.3, -30);
    this.camPos.copy(this.camera.position);

    // The doorway of light opens as we move in.
    const open = smoothstep(0.04, 0.82, s);
    // Brightness stays full through Hero, then settles for Meaning and sinks
    // further for Issue so the words read strongly without cutting the space.
    const exposure = 1 - 0.55 * smoothstep(0.3, 1, s);

    this.floorMat.uniforms.uTime.value = t;
    this.floorMat.uniforms.uOpen.value = open;
    this.floorMat.uniforms.uExposure.value = exposure;
    this.backlightMat.uniforms.uTime.value = t;
    this.backlightMat.uniforms.uOpen.value = open;
    this.backlightMat.uniforms.uExposure.value = exposure;

    // Drift the few motes gently upward through the light.
    const attr = this.motes.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < this.moteSpeeds.length; i++) {
      arr[i * 3 + 1] += this.moteSpeeds[i] * 0.016;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = 0.2;
    }
    attr.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  };

  start(): void {
    if (this.raf) return;
    this.clock.start();
    this.frame();
  }

  stop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  dispose(): void {
    this.stop();
    window.removeEventListener('resize', this.resize);
    for (const d of this.disposables) d.dispose();
    this.renderer.dispose();
  }
}
