'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LS_KEY = 'gif_enabled';

interface GifContextValue {
  enabled: boolean;
  toggle: () => void;
}

const GifContext = createContext<GifContextValue>({ enabled: true, toggle: () => {} });

export function GifProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    if (stored !== null) setEnabled(stored === 'true');
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(LS_KEY, String(next));
      return next;
    });
  };

  return <GifContext.Provider value={{ enabled, toggle }}>{children}</GifContext.Provider>;
}

export function useGifEnabled() {
  return useContext(GifContext);
}
