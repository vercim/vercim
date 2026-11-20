'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArtSlotProps {
  src: string;
  alt: string;
  sizes: string;
  width: number;
  height: number;
  parallax: 'minecraft' | 'roblox';
}

// Owner-supplied art from public/. Until the file exists, the slot stays empty.
export function ArtSlot({ src, alt, sizes, width, height, parallax }: ArtSlotProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className="showcase-art reveal__fade">
      {missing ? null : (
        <Image
          className="art-slot__parallax h-auto w-full object-cover object-top"
          data-parallax={parallax}
          src={src}
          alt={alt}
          sizes={sizes}
          quality={90}
          width={width}
          height={height}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
