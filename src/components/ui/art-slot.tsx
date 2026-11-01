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
}

// Owner-supplied art from public/. Until the file exists, the slot stays empty.
export function ArtSlot({ src, alt, sizes, width, height, className }: ArtSlotProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className={['art-slot', className].filter(Boolean).join(' ')}>
      {missing ? null : (
        <Image
          className="art-slot__image"
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
