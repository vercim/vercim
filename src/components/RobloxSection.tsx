import type { CSSProperties } from 'react';
import { ArtSlot } from '@/components/ui/art-slot';

export function RobloxSection() {
  return (
    <section
      id="games"
      className="relative z-1 grid min-h-svh grid-cols-1 gap-[clamp(2rem,5vw,5rem)] bg-roblox-accent pt-[clamp(3rem,5vw,6rem)] pr-[clamp(3rem,5vw,6rem)] pl-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] text-on-dark max-[680px]:flex max-[680px]:flex-col max-[680px]:gap-0 max-[680px]:pr-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] max-[680px]:pb-[min(78vw,55dvh)]"
      data-reveal
    >
      <ArtSlot
        className="reveal__fade pointer-events-none absolute bottom-0 left-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] w-[50vw] max-[680px]:right-0 max-[680px]:left-0 max-[680px]:mx-auto max-[680px]:w-[min(100%,70dvh)]"
        cut
        src="/char_rbx.png"
        alt="My Roblox character"
        sizes="(max-width: 680px) 85vw, 45vw"
        width={2069}
        height={1495}
      />

      <h2 className="relative z-1 m-0 self-start justify-self-end text-[clamp(1.75rem,4.8vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.045em] max-[680px]:-order-1 max-[680px]:justify-self-start">
        <span className="reveal whitespace-nowrap max-[680px]:whitespace-normal">
          <span className="reveal__line">i also make games!</span>
        </span>{' '}
        <span
          className="reveal block whitespace-nowrap text-on-dark-soft max-[680px]:whitespace-normal"
          style={{ '--reveal-delay': '0.1s' } as CSSProperties}
        >
          <span className="reveal__line">roblox, luau</span>
        </span>
      </h2>

      <p
        className="reveal absolute top-[35%] right-[13%] z-1 m-0 block w-[clamp(18rem,28vw,28rem)] text-[clamp(1.25rem,2vw,2rem)] leading-[1.15] tracking-[-0.035em] text-balance text-on-dark-soft max-[680px]:static max-[680px]:mt-5 max-[680px]:ml-0 max-[680px]:w-auto max-[680px]:max-w-[32ch]"
        style={{ '--reveal-delay': '0.2s' } as CSSProperties}
      >
        <span className="reveal__line">
          smooth blender animations, polished interfaces and fault-tolerant systems
        </span>
      </p>
    </section>
  );
}
