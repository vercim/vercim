'use client';

import { useTheme } from 'next-themes';
import { useGifEnabled } from '@/hooks/useGifEnabled';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';
import { TextMorph } from 'torph/react';

export function Footer() {
  const year = new Date().getFullYear();
  const { enabled: gifEnabled, toggle: toggleGif } = useGifEnabled();
  const { enabled: motionEnabled, toggle: toggleMotion } = useMotionEnabled();
  const { theme, setTheme } = useTheme();
  const isDark = theme !== 'light';

  return (
    <footer className="flex justify-between items-center h-14 px-6 border-t border-divider text-[0.8rem] text-faint tracking-[0.04em]">
      <p>directed by vercim</p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleGif}
          className="px-2 py-1 rounded-full text-inherit text-[0.8rem] font-[400] tracking-[0.04em] cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{gifEnabled ? 'GIFs enabled' : 'GIFs disabled'}</TextMorph>
        </button>
        <span className="text-sep font-black select-none">/</span>
        <button
          type="button"
          onClick={toggleMotion}
          className="px-2 py-1 rounded-full text-inherit text-[0.8rem] font-[400] tracking-[0.04em] cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{motionEnabled ? 'Motion enabled' : 'Motion disabled'}</TextMorph>
        </button>
        <span className="text-sep font-black select-none">/</span>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="px-2 py-1 rounded-full text-inherit text-[0.8rem] font-[400] tracking-[0.04em] cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{isDark ? 'Theme dark' : 'Theme light'}</TextMorph>
        </button>
      </div>

      <p>{year}</p>
    </footer>
  );
}
