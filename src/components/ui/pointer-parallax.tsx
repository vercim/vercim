'use client';

import { useEffect } from 'react';

export function PointerParallax() {
  useEffect(() => {
    const motion = window.matchMedia('(any-pointer: fine) and (prefers-reduced-motion: no-preference)');
    const images = document.getElementsByClassName('art-slot__parallax');
    let frame = 0;
    let position: { x: number; y: number } | null = null;

    function updatePosition() {
      frame = 0;
      for (const image of images) {
        if (!(image instanceof HTMLImageElement)) continue;
        if (position) {
          image.style.setProperty('--pointer-x', String(position.x));
          image.style.setProperty('--pointer-y', String(position.y));
        } else {
          image.style.removeProperty('--pointer-x');
          image.style.removeProperty('--pointer-y');
        }
      }
    }

    function schedulePosition() {
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
    }

    function move(event: PointerEvent) {
      if (!motion.matches || event.pointerType !== 'mouse') return;
      position = {
        x: 1 - (2 * event.clientX) / window.innerWidth,
        y: Math.min(1, Math.max(0, 1 - event.clientY / window.innerHeight)),
      };
      schedulePosition();
    }

    function reset() {
      position = null;
      schedulePosition();
    }

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);
    motion.addEventListener('change', reset);

    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
      motion.removeEventListener('change', reset);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
