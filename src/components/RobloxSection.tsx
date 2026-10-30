import type { CSSProperties } from 'react';
import { ArtSlot } from '@/components/ui/art-slot';

export function RobloxSection() {
  return (
    <section id="games" className="roblox" data-reveal>
      <ArtSlot
        className="roblox__character art-slot--cut reveal__fade"
        src="/images/roblox/character.png"
        alt="My Roblox character"
        sizes="(max-width: 680px) 85vw, 45vw"
      />

      <h2 className="roblox__phrase">
        <span className="reveal">
          <span className="reveal__line">i also make games!</span>
        </span>{' '}
        <span className="roblox__note reveal" style={{ '--reveal-delay': '0.1s' } as CSSProperties}>
          <span className="reveal__line">(roblox, luau lang)</span>
        </span>
      </h2>
    </section>
  );
}
