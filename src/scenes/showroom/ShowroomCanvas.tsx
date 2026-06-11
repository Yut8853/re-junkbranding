import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Showroom } from './Showroom';

function transitionStrength(progress: number): number {
  return Math.pow(Math.sin(progress * Math.PI), 0.86);
}

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
    const triggers: ScrollTrigger[] = [];
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => scene.setScroll(self.progress),
    });
    triggers.push(trigger);

    // Same generic boundary windows as the page script: one transition per
    // adjacent pair of `.page > section`, anchored on content positions.
    const pageEl = document.querySelector<HTMLElement>('.page');
    const sections = pageEl
      ? Array.from(pageEl.querySelectorAll<HTMLElement>(':scope > section'))
      : [];
    sections.forEach((fromSection, index) => {
      const toSection = sections[index + 1];
      if (!toSection) return;
      const fromInner = fromSection.querySelector<HTMLElement>(':scope > [class*="__inner"]');
      const toInner = toSection.querySelector<HTMLElement>(':scope > [class*="__inner"]');
      if (!fromInner || !toInner) return;

      triggers.push(ScrollTrigger.create({
        trigger: fromSection,
        start: () =>
          fromSection.offsetTop + fromInner.offsetTop + fromInner.offsetHeight - window.innerHeight * 0.55,
        endTrigger: toSection,
        end: () => toSection.offsetTop + toInner.offsetTop - window.innerHeight,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scene.setGravity({
            strength: transitionStrength(self.progress),
            progress: self.progress,
            direction: self.direction >= 0 ? 1 : -1,
          });
        },
        onLeave: () => scene.setGravity({ strength: 0, progress: 1, direction: 1 }),
        onLeaveBack: () => scene.setGravity({ strength: 0, progress: 0, direction: -1 }),
      }));
    });

    return () => {
      window.removeEventListener('pointermove', onPointer);
      triggers.forEach((item) => item.kill());
      scene.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="showroom-canvas" aria-hidden="true" />;
}
