'use client';

import { Lottie, type LottieHandle } from 'lottie-react';
import { useEffect, useRef } from 'react';

import avatarsChatting from '@/assets/lottie/avatars-chatting.json';
import payment from '@/assets/lottie/payment.json';
import clock from '@/assets/lottie/clock.json';
import medalFirstPlace from '@/assets/lottie/medal-first-place.json';

const animations = {
  chat: avatarsChatting,
  speed: clock,
  payment,
  rank: medalFirstPlace,
};

export type BentoIconName = keyof typeof animations;

/**
 * Marker segments of a multi-part animation: the segment played on load
 * (an entrance segment, when present, is skipped) and two hover segments
 * played in turn.
 */
interface BentoIconSegments {
  idle: string;
  hover: readonly [string, string];
}

interface BentoIconProps {
  name: BentoIconName;
  className: string;
  segments?: BentoIconSegments;
}

export function BentoIcon({ name, className, segments }: BentoIconProps) {
  const lottieRef = useRef<LottieHandle>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);
  const hoverAlt = useRef(false);

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleReady = () => {
    const lottie = lottieRef.current;
    if (!lottie) return;
    if (segments) {
      if (reduceMotion.current) {
        lottie.seek({ marker: segments.idle });
        return;
      }
      lottie.playSegments({ marker: segments.idle });
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
    if (segments) {
      hoverAlt.current = !hoverAlt.current;
      lottie.playSegments({ marker: segments.hover[hoverAlt.current ? 1 : 0] });
      return;
    }
    lottie.stop();
    lottie.play();
  };

  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  });

  // Hovering anywhere on the card replays the icon's animation.
  useEffect(() => {
    const card = rootRef.current?.closest('.bento__card');
    if (!card) return;
    const handler = () => playRef.current();
    card.addEventListener('pointerenter', handler);
    card.addEventListener('pointerdown', handler);
    return () => {
      card.removeEventListener('pointerenter', handler);
      card.removeEventListener('pointerdown', handler);
    };
  }, []);

  return (
    <div ref={rootRef} className={className} aria-hidden="true">
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
