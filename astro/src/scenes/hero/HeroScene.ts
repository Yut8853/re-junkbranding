import * as THREE from 'three';

import roomVert from './shaders/room.vert.glsl?raw';
import roomFrag from './shaders/room.frag.glsl?raw';
import apertureVert from './shaders/aperture.vert.glsl?raw';
import apertureFrag from './shaders/aperture.frag.glsl?raw';

const BG = 0x06070b;
const APERTURE_POS = new THREE.Vector3(0, 5.4, -22);

/**
 * Digital Showroom.
 * A single, calm 3D space: a refined room receding into fog, lit by one
 * luminous aperture at the far end — the brand world standing up beyond the
 * screen. The camera eases forward on scroll and drifts gently with the mouse.
 */
export class HeroScene {
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

  private readonly camPos = new THREE.Vector3();
  private readonly roomMaterials: THREE.ShaderMaterial[] = [];
  private apertureMat!: THREE.ShaderMaterial;
  private readonly disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

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
    this.scene.fog = new THREE.FogExp2(BG, 0.02);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.1, 220);
    this.camera.position.set(0, 3.2, 8);
    this.camPos.copy(this.camera.position);

    this.build();
    this.resize();
    window.addEventListener('resize', this.resize);
  }

  private roomMaterial(): THREE.ShaderMaterial {
    const mat = new THREE.ShaderMaterial({
      vertexShader: roomVert,
      fragmentShader: roomFrag,
      uniforms: {
        uTime: { value: 0 },
        uBase: { value: new THREE.Color(0x070910) },
        uGlow: { value: new THREE.Color(0x33405e) },
        uAperture: { value: APERTURE_POS.clone() },
        uCamPos: { value: this.camPos },
      },
    });
    this.roomMaterials.push(mat);
    this.disposables.push(mat);
    return mat;
  }

  private mesh(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
    this.disposables.push(geo);
    return new THREE.Mesh(geo, mat);
  }

  private build(): void {
    // Floor.
    const floor = this.mesh(new THREE.PlaneGeometry(160, 160), this.roomMaterial());
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = -34;
    this.scene.add(floor);

    // Ceiling — encloses the space into a corridor.
    const ceiling = this.mesh(new THREE.PlaneGeometry(160, 160), this.roomMaterial());
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 17, -34);
    this.scene.add(ceiling);

    // Side walls — frame the showroom and carry the aperture's glow inward.
    const wallGeo = new THREE.PlaneGeometry(140, 17);
    const left = this.mesh(wallGeo, this.roomMaterial());
    left.rotation.y = Math.PI / 2;
    left.position.set(-12, 8.5, -34);
    this.scene.add(left);

    const right = this.mesh(wallGeo.clone(), this.roomMaterial());
    right.rotation.y = -Math.PI / 2;
    right.position.set(12, 8.5, -34);
    this.scene.add(right);

    // Aperture — the single luminous world rising at the far end.
    this.apertureMat = new THREE.ShaderMaterial({
      vertexShader: apertureVert,
      fragmentShader: apertureFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uWarm: { value: new THREE.Color(0xffd9a8) },
        uCool: { value: new THREE.Color(0x88a6dd) },
      },
    });
    this.disposables.push(this.apertureMat);

    const aperture = this.mesh(new THREE.PlaneGeometry(8.5, 13), this.apertureMat);
    aperture.position.copy(APERTURE_POS);
    this.scene.add(aperture);
  }

  setPointer(x: number, y: number): void {
    this.pointerTarget.set(x, y);
  }

  setScroll(progress: number): void {
    this.scroll = Math.min(Math.max(progress, 0), 1);
  }

  private readonly resize = (): void => {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  };

  private readonly frame = (): void => {
    this.raf = requestAnimationFrame(this.frame);
    const t = this.clock.getElapsedTime();

    // Ease the pointer for a smooth, weighted parallax.
    const ease = this.reduced ? 1 : 0.05;
    this.pointer.x += (this.pointerTarget.x - this.pointer.x) * ease;
    this.pointer.y += (this.pointerTarget.y - this.pointer.y) * ease;

    const px = this.reduced ? 0 : this.pointer.x;
    const py = this.reduced ? 0 : this.pointer.y;

    // Scroll eases the camera a little deeper into the space (no scroll-jacking).
    const targetZ = 8 - this.scroll * 4.5;
    const targetY = 3.2 + this.scroll * 0.7;

    this.camera.position.x += (px * 1.15 - this.camera.position.x) * 0.06;
    this.camera.position.y += (targetY - py * 0.6 - this.camera.position.y) * 0.06;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.06;
    this.camera.lookAt(px * 0.6, 4.4 + py * 0.3, -22);
    this.camPos.copy(this.camera.position);

    for (const m of this.roomMaterials) m.uniforms.uTime.value = t;
    this.apertureMat.uniforms.uTime.value = t;

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
