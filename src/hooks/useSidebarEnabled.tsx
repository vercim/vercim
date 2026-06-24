'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const LS_KEY = 'sidebar_enabled';

interface SidebarContextValue {
  enabled: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({ enabled: true, toggle: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useIsomorphicLayoutEffect(() => {
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

  return <SidebarContext.Provider value={{ enabled, toggle }}>{children}</SidebarContext.Provider>;
}

export function useSidebarEnabled() {
  return useContext(SidebarContext);
}
