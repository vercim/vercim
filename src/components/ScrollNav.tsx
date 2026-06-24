'use client';

import { useEffect, useState } from 'react';
import { Globe, Layers, SquarePlay } from 'lucide-react';
import { useSidebarEnabled } from '@/hooks/useSidebarEnabled';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';

const SECTIONS = [
  { id: 'home',     icon: Globe,       label: 'Home' },
  { id: 'projects', icon: Layers,      label: 'Projects' },
  { id: 'videos',   icon: SquarePlay,  label: 'Videos' },
] as const;

export function ScrollNav() {
  const [active, setActive] = useState<string>('home');
  const { enabled: sidebarEnabled } = useSidebarEnabled();
  const { enabled: motionEnabled } = useMotionEnabled();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' });

  return (
    <nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        transform: sidebarEnabled ? 'translateX(0)' : 'translateX(-48px)',
        opacity:   sidebarEnabled ? 1 : 0,
        pointerEvents: sidebarEnabled ? 'auto' : 'none',
      }}
      aria-label="Page sections"
    >
      {SECTIONS.map(({ id, icon: Icon, label }, i) => {
        const isActive = active === id;
        const isLast   = i === SECTIONS.length - 1;

        return (
          <div key={id} className="flex flex-col items-center">
            <button
              onClick={() => scrollTo(id)}
              title={label}
              aria-label={`Go to ${label}`}
              className={`
                flex items-center justify-center w-8 h-8 transition-colors duration-300
                ${isActive ? 'text-fg' : 'text-faint hover:text-muted'}
              `}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
            </button>

            {!isLast && (
              <div className="w-px h-10 bg-line-soft" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
