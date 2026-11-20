import type { CSSProperties } from 'react';

export function revealDelay(seconds: number): CSSProperties & { '--reveal-delay': string } {
  return { '--reveal-delay': `${seconds}s` };
}
