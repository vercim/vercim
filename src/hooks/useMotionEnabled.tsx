'use client';

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const LS_KEY = 'motion_enabled';
const NO_MOTION_CLASS = 'no-motion';

interface MotionContextValue {
  enabled: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue>({ enabled: true, toggle: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    const initial = stored !== null ? stored === 'true' : true;
    if (!initial) {
      setEnabled(false);
      document.documentElement.classList.add(NO_MOTION_CLASS);
    }
  }, []);

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(LS_KEY, String(next));
      document.documentElement.classList.toggle(NO_MOTION_CLASS, !next);
      return next;
    });
  };

  return <MotionContext.Provider value={{ enabled, toggle }}>{children}</MotionContext.Provider>;
}

export function useMotionEnabled() {
  return useContext(MotionContext);
}
