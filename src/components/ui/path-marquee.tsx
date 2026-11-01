'use client';

import { useEffect, useRef } from 'react';

// A loop in the middle; both ends run past the viewBox so items wrap out of sight.
const PATH =
  'M -40 250 C 150 300 380 330 480 220 C 590 100 520 -10 430 40 C 340 90 360 250 520 275 C 660 297 900 200 1040 160';
const PATH_LENGTH = 1701; // getTotalLength() of PATH
const ITEM = 44;
const SLOTS = Math.floor(PATH_LENGTH / (ITEM + 6));
const LAP_SECONDS = 70;

// Square images that travel along a curved path (SVG animateMotion). The
// motion stops when the visitor prefers reduced motion.
export function PathMarquee({ images }: { images: string[] }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (media.matches) svgRef.current?.pauseAnimations();
      else svgRef.current?.unpauseAnimations();
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="ml-[50%] block h-auto w-[max(100%,56rem)] -translate-x-1/2"
      viewBox="0 0 1000 340"
      aria-hidden="true"
    >
      {Array.from({ length: SLOTS }, (_, slot) => {
        const src = images.length > 0 ? images[slot % images.length] : null;

        return (
          <g key={slot}>
            <animateMotion
              path={PATH}
              dur={`${LAP_SECONDS}s`}
              begin={`${(-slot * LAP_SECONDS) / SLOTS}s`}
              repeatCount="indefinite"
              rotate="auto"
            />
            {src ? (
              <image
                href={src}
                x={-ITEM / 2}
                y={-ITEM / 2}
                width={ITEM}
                height={ITEM}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <rect
                className="fill-current opacity-[0.12]"
                x={-ITEM / 2}
                y={-ITEM / 2}
                width={ITEM}
                height={ITEM}
                rx={4}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
