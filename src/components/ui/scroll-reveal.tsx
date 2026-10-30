'use client';

import { useEffect } from 'react';

// Marks every [data-reveal] block with .is-visible once it scrolls into view,
// which starts its reveal animations. Without JavaScript the noscript style
// keeps the content visible.
export function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll('[data-reveal]').forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return (
    <noscript>
      <style>{'[data-reveal] .reveal__line, [data-reveal] .reveal__fade { animation: none; }'}</style>
    </noscript>
  );
}
