'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArtSlotProps {
  src: string;
  alt: string;
  sizes: string;
  width: number;
  height: number;
  className?: string;
  cut?: boolean;
}

// Owner-supplied art from public/. Until the file exists, the slot stays empty.
export function ArtSlot({ src, alt, sizes, width, height, className, cut = false }: ArtSlotProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className={className}>
      {missing ? null : (
        <Image
          className={`h-auto w-full ${cut ? 'object-cover object-top' : 'object-contain object-bottom'}`}
          src={src}
          alt={alt}
          sizes={sizes}
          width={width}
          height={height}
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
