import * as THREE from 'three';

import floorVert from './shaders/floor.vert.glsl?raw';
import floorFrag from './shaders/floor.frag.glsl?raw';
import backlightVert from './shaders/backlight.vert.glsl?raw';
import backlightFrag from './shaders/backlight.frag.glsl?raw';
import { makeExhibitTexture, makeGlowTexture } from './textures';

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
    this.buildWalls();
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
        uBase: { value: new THREE.Color(0x080a11) },
        uGlow: { value: new THREE.Color(0x6f7ea6) },
        uAperture: { value: APERTURE.clone() },
        uCamPos: { value: this.camPos },
      },
    });
    this.track(this.floorMat);

    const geo = this.track(new THREE.PlaneGeometry(48, 120, 1, 1));
    const floor = new THREE.Mesh(geo, this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -28;
    this.scene.add(floor);
  }

  private buildWalls(): void {
    const wallMat = this.track(
      new THREE.MeshBasicMaterial({ color: 0x090b11, fog: true }),
    );
    const geo = this.track(new THREE.PlaneGeometry(80, 11));

    const left = new THREE.Mesh(geo, wallMat);
    left.position.set(-7, 5.2, -22);
    left.rotation.y = Math.PI / 2;
    this.scene.add(left);

    const right = new THREE.Mesh(geo, wallMat);
    right.position.set(7, 5.2, -22);
    right.rotation.y = -Math.PI / 2;
    this.scene.add(right);
  }

  private exhibit(
    texture: THREE.CanvasTexture,
    pos: [number, number, number],
    facing: 1 | -1,
  ): void {
    const group = new THREE.Group();

    // Warm-dark matte frame behind the plate.
    const frameMat = this.track(
      new THREE.MeshBasicMaterial({ color: facing === 1 ? 0x1c1610 : 0x121620, fog: true }),
    );
    const frameGeo = this.track(new THREE.PlaneGeometry(3.7, 4.6));
    const frame = new THREE.Mesh(frameGeo, frameMat);
    group.add(frame);

    // The exhibit plate itself.
    this.track(texture);
    const plateMat = this.track(
      new THREE.MeshBasicMaterial({ map: texture, fog: true, toneMapped: false }),
    );
    const plateGeo = this.track(new THREE.PlaneGeometry(3.3, 4.1));
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.z = 0.02;
    group.add(plate);

    group.position.set(pos[0], pos[1], pos[2]);
    // Face the path, angled slightly toward the entrance so visitors approach it.
    group.rotation.y = facing * Math.PI * 0.5 - facing * 0.14;
    this.scene.add(group);
  }

  private buildExhibits(): void {
    // Two exhibits only — one warm, one cool — staggered down the path.
    this.exhibit(makeExhibitTexture('warm'), [6.7, 2.7, -8], -1);
    this.exhibit(makeExhibitTexture('cool'), [-6.7, 2.7, -15], 1);
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

    const geo = this.track(new THREE.PlaneGeometry(11, 9));
    const light = new THREE.Mesh(geo, this.backlightMat);
    light.position.copy(APERTURE);
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
    // Brightness stays full through Hero, then settles for Meaning / Issue.
    const exposure = 1 - 0.4 * smoothstep(0.32, 1, s);

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
