'use client';

import { useTheme } from 'next-themes';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';
import { useSidebarEnabled } from '@/hooks/useSidebarEnabled';
import { TextMorph } from 'torph/react';

export function Footer() {
  const year = new Date().getFullYear();
  const { enabled: motionEnabled, toggle: toggleMotion } = useMotionEnabled();
  const { enabled: sidebarEnabled, toggle: toggleSidebar } = useSidebarEnabled();
  const { theme, setTheme } = useTheme();
  const isDark = theme !== 'light';

  return (
    <footer className="flex flex-col gap-3 py-4 px-6 border-t border-divider type-body text-faint sm:flex-row sm:justify-between sm:items-center sm:h-14 sm:gap-0 sm:py-0">
      <p className="type-body">directed by vercim</p>

      <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:gap-1.5">
        <button
          type="button"
          onClick={toggleMotion}
          className="px-3 py-1 rounded-full text-inherit type-body cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{motionEnabled ? 'Motion enabled' : 'Motion disabled'}</TextMorph>
        </button>
        <span className="hidden sm:inline text-sep font-black select-none">/</span>
        <button
          type="button"
          onClick={toggleSidebar}
          className="px-3 py-1 rounded-full text-inherit type-body cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{sidebarEnabled ? 'Sidebar enabled' : 'Sidebar disabled'}</TextMorph>
        </button>
        <span className="hidden sm:inline text-sep font-black select-none">/</span>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="px-3 py-1 rounded-full text-inherit type-body cursor-pointer transition-[color,background] hover:bg-line-hover hover:text-muted"
        >
          <TextMorph disabled={!motionEnabled}>{isDark ? 'Theme dark' : 'Theme light'}</TextMorph>
        </button>
      </div>

      <p className="type-body">{year}</p>
    </footer>
  );
}
