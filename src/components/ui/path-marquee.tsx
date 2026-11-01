'use client';

import { useEffect, useRef } from 'react';

// A loop in the middle; both ends run past the viewBox so items wrap out of sight.
const PATH =
  'M -40 250 C 150 300 380 330 480 220 C 590 100 520 -10 430 40 C 340 90 360 250 520 275 C 660 297 900 200 1040 160';
const PATH_LENGTH = 1701; // getTotalLength() of PATH
const ITEM_WIDTH = 88;
const ITEM_HEIGHT = 31;
const ITEM_GAP = 54;
const SLOTS = Math.floor(PATH_LENGTH / (ITEM_WIDTH + ITEM_GAP));
const LAP_SECONDS = 70;

// 88×31 images that travel along a curved path (SVG animateMotion). The
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
    <svg ref={svgRef} className="path-marquee" viewBox="0 0 1000 340" aria-hidden="true">
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
                x={-ITEM_WIDTH / 2}
                y={-ITEM_HEIGHT / 2}
                width={ITEM_WIDTH}
                height={ITEM_HEIGHT}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <rect
                className="path-marquee__placeholder"
                x={-ITEM_WIDTH / 2}
                y={-ITEM_HEIGHT / 2}
                width={ITEM_WIDTH}
                height={ITEM_HEIGHT}
                rx={4}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
