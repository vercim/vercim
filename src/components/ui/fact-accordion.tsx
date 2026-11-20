'use client';

import { BentoIcon, type BentoIconName } from '@/components/ui/bento-icon';

const facts: { icon: BentoIconName; topic: string; hint: string }[] = [
  { icon: 'speed', topic: 'Delivery', hint: 'Fast product implementation' },
  { icon: 'payment', topic: 'Payment', hint: 'Crypto payment accepted' },
  { icon: 'mods', topic: 'Minecraft', hint: 'Multiloader & multiversion mods' },
  { icon: 'rank', topic: 'Roblox', hint: 'Verified scripter in community' },
];

export function FactAccordion() {
  return (
    <fieldset className="bento-facts reveal__fade">
      <legend className="sr-only">Facts about working with me</legend>
      {facts.map(({ icon, topic, hint }, index) => (
        <div key={icon} className="bento-fact" data-bento-card>
          <input
            id={`fact-${icon}`}
            type="radio"
            name="about-fact"
            className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
            aria-describedby={`hint-${icon}`}
            defaultChecked={index === 0}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') event.currentTarget.checked = true;
            }}
          />
          <label className="bento-fact-topic" htmlFor={`fact-${icon}`}>{topic}</label>
          <div className="bento-fact-content">
            <BentoIcon name={icon} />
            <p id={`hint-${icon}`} className="max-w-[18ch] text-xl leading-tight tracking-tight text-balance wrap-anywhere lg:text-2xl">
              {hint}
            </p>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
