'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LS_KEY = 'motion_enabled';
const NO_MOTION_CLASS = 'no-motion';

interface MotionContextValue {
  enabled: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue>({ enabled: true, toggle: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(LS_KEY);
    const initial = stored !== null ? stored === 'true' : true;
    setEnabled(initial);
    if (!initial) document.documentElement.classList.add(NO_MOTION_CLASS);
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
