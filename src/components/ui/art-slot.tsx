'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArtSlotProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
}

// Owner-supplied art from public/. Until the file exists, the slot shows its
// expected path so it is clear where to put it.
export function ArtSlot({ src, alt, sizes, className }: ArtSlotProps) {
  const [missing, setMissing] = useState(false);

  return (
    <div className={['art-slot', className].filter(Boolean).join(' ')}>
      {missing ? (
        <span className="art-slot__placeholder">public{src}</span>
      ) : (
        <Image className="art-slot__image" src={src} alt={alt} sizes={sizes} fill onError={() => setMissing(true)} />
      )}
    </div>
  );
}
