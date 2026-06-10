import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { HeroScene } from './HeroScene';

/**
 * React island that mounts the Three.js Digital Showroom and wires it to
 * pointer movement and the hero section's scroll progress (via ScrollTrigger).
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new HeroScene(canvas);
    scene.start();

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      scene.setPointer(x, y);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let trigger: ScrollTrigger | undefined;
    const section = canvas.closest<HTMLElement>('[data-hero]');
    if (section) {
      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => scene.setScroll(self.progress),
      });
    }

    return () => {
      window.removeEventListener('pointermove', onPointer);
      trigger?.kill();
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
