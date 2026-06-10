import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Showroom } from './Showroom';

/**
 * The Digital Showroom canvas — mounted once as a fixed, full-page background
 * that persists behind Hero, Meaning and Issue. A single ScrollTrigger maps
 * the whole page's scroll progress to the camera walking into the space.
 */
export default function ShowroomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new Showroom(canvas);
    scene.start();

    const onPointer = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      scene.setPointer(x, y);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => scene.setScroll(self.progress),
    });

    return () => {
      window.removeEventListener('pointermove', onPointer);
      trigger.kill();
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="showroom-canvas" aria-hidden="true" />;
}
