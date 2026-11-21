'use client';

import { useEffect, useRef } from 'react';

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const root = document.documentElement;
    // Match the native overscroll background before the footer reaches the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      root.toggleAttribute('data-near-page-end', entry.isIntersecting);
    }, { rootMargin: '0px 0px 96px 0px' });

    observer.observe(footer);

    return () => {
      observer.disconnect();
      root.removeAttribute('data-near-page-end');
    };
  }, []);

  return (
    <footer ref={footerRef} className="flex h-header items-center justify-center bg-dark px-5 font-normal text-on-dark">
      <a className="site-nav site-nav-link" href="#top">go back</a>
    </footer>
  );
}
