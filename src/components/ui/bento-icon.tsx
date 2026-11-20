'use client';

import { Lottie, type LottieHandle } from 'lottie-react';
import { useEffect, useRef } from 'react';

import payment from '@/assets/lottie/payment.json';
import clock from '@/assets/lottie/clock.json';
import layers from '@/assets/lottie/layers.json';
import medalFirstPlace from '@/assets/lottie/medal-first-place.json';

const animations = {
  speed: clock,
  payment,
  mods: layers,
  rank: medalFirstPlace,
};

export type BentoIconName = keyof typeof animations;

export function BentoIcon({ name }: { name: BentoIconName }) {
  const marker = name === 'mods' ? 'hover-pinch' : undefined;
  const lottieRef = useRef<LottieHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleReady = () => {
    const lottie = lottieRef.current;
    if (!lottie) return;
    if (marker) {
      // Seek past the blank entrance frame before playback starts.
      lottie.seek({ marker });
      if (reduceMotion.current) return;
      lottie.playSegments({ marker });
      return;
    }
    if (reduceMotion.current) {
      lottie.seek({ percent: 50 });
      return;
    }
    lottie.play();
  };

  const play = () => {
    const lottie = lottieRef.current;
    if (!lottie || reduceMotion.current) return;
    if (marker) {
      lottie.playSegments({ marker });
      return;
    }
    lottie.stop();
    lottie.play();
  };

  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    const card = rootRef.current?.closest('[data-bento-card]');
    if (!card) return;
    const handler = () => playRef.current();
    card.addEventListener('click', handler);
    return () => card.removeEventListener('click', handler);
  }, []);

  return (
    <div ref={rootRef} className="bento-icon" aria-hidden="true">
      <Lottie
        lottieRef={lottieRef}
        src={animations[name]}
        autoplay={false}
        loop={false}
        subscriptions={{ ready: handleReady }}
        rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
      />
    </div>
  );
}
