import type { CSSProperties } from 'react';

import { BentoIcon } from '@/components/ui/bento-icon';

function revealStyle(index: number): CSSProperties {
  return { '--reveal-delay': `${index * 0.08}s` } as CSSProperties;
}

const cardClass =
  'reveal__fade flex min-w-0 flex-col overflow-hidden rounded-[clamp(0.875rem,1.2vw,1.125rem)] border border-on-dark-border bg-bento-card p-[clamp(1.25rem,2vw,1.75rem)] text-inherit max-[680px]:min-h-42';
const visualClass = 'flex min-h-10 flex-1 items-start justify-start pb-4';
const titleClass =
  'm-0 max-w-[16ch] text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.08] tracking-[-0.035em] text-balance';

export function BentoSection() {
  return (
    <section
      id="bento"
      className="relative z-2 flex min-h-svh items-center bg-dark py-[clamp(4rem,8vw,8rem)] pr-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,7vw,7rem))] pl-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] text-on-dark max-[680px]:min-h-0 max-[680px]:py-[clamp(3rem,12vw,5rem)]"
      aria-label="More about working with me"
      data-reveal
    >
      <div className="w-full">
        <div className="grid w-full auto-rows-[minmax(clamp(10rem,15vw,13rem),auto)] grid-cols-12 gap-[clamp(0.625rem,1vw,0.875rem)] max-[680px]:auto-rows-auto max-[680px]:grid-cols-2">
          <article
            className={`${cardClass} col-span-5 row-span-2 max-[680px]:col-span-full max-[680px]:row-auto max-[680px]:min-h-76`}
            style={revealStyle(0)}
            data-bento-card
          >
            <div className="flex min-h-10 flex-1 items-center justify-center pb-4">
              <BentoIcon
                name="chat"
                className="aspect-square w-[clamp(8rem,14vw,12rem)]"
                segments={{
                  idle: 'hover-conversation',
                  hover: ['hover-conversation', 'hover-conversation-alt'],
                }}
              />
            </div>
            <div>
              <h2 className="m-0 max-w-[11ch] text-[clamp(2rem,3.4vw,3.5rem)] leading-[0.98] tracking-[-0.05em] text-balance max-[680px]:text-[clamp(2rem,10vw,3rem)]">
                Let’s get down to business
              </h2>
            </div>
          </article>

          <article
            className={`${cardClass} col-span-3 max-[680px]:col-auto max-[680px]:row-auto`}
            style={revealStyle(1)}
            data-bento-card
          >
            <div className={visualClass}>
              <BentoIcon name="speed" className="aspect-square w-[clamp(3rem,4vw,4rem)]" />
            </div>
            <div>
              <h2 className={titleClass}>Fast product implementation</h2>
            </div>
          </article>

          <article
            className={`${cardClass} col-span-4 max-[680px]:col-auto max-[680px]:row-auto`}
            style={revealStyle(2)}
            data-bento-card
          >
            <div className={visualClass}>
              <BentoIcon name="payment" className="aspect-square w-[clamp(3rem,4vw,4rem)]" />
            </div>
            <div>
              <h2 className={titleClass}>I accept payment in Crypto, Ruble</h2>
            </div>
          </article>

          <article
            className={`${cardClass} col-span-4 max-[680px]:col-auto max-[680px]:row-auto`}
            style={revealStyle(3)}
            data-bento-card
          >
            <div className={visualClass}>
              <BentoIcon
                name="mods"
                className="aspect-square w-[clamp(3rem,4vw,4rem)]"
                segments={{ idle: 'hover-pinch', hover: ['hover-pinch'] }}
              />
            </div>
            <div>
              <h2 className={titleClass}>Multiloader &amp; multiversion mods</h2>
            </div>
          </article>

          <article
            className={`${cardClass} col-span-3 max-[680px]:col-auto max-[680px]:row-auto`}
            style={revealStyle(4)}
            data-bento-card
          >
            <div className={visualClass}>
              <BentoIcon name="rank" className="aspect-square w-[clamp(3rem,4vw,4rem)]" />
            </div>
            <div>
              <h2 className={titleClass}>Verified scripter in roblox community</h2>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
