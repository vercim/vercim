import { BentoIcon, type BentoIconName } from '@/components/ui/bento-icon';

const facts: { icon: BentoIconName; topic: string; hint: string }[] = [
  {
    icon: 'speed',
    topic: 'Delivery',
    hint: 'I move quickly from idea to implementation so you can try a working version early.',
  },
  {
    icon: 'payment',
    topic: 'Payment',
    hint: 'I accept crypto payments for project work. We can discuss payment details when we agree on the scope.',
  },
  {
    icon: 'mods',
    topic: 'Tech Stack',
    hint: 'I build Minecraft mods for Fabric, Forge, and NeoForge, script gameplay and UI in Luau, and animate in Blender.',
  },
  {
    icon: 'rank',
    topic: 'Certification',
    hint: 'I hold Verified Scripter status in the Roblox developer community.',
  },
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
          />
          <label className="bento-fact-topic" htmlFor={`fact-${icon}`}>{topic}</label>
          <div className="bento-fact-reveal">
            <div className="min-h-0 overflow-hidden">
              <div className="bento-fact-content">
                <span
                  className="bento-fact-expanded-topic absolute inset-s-5 top-5 hidden text-base font-medium desktop:block"
                  aria-hidden="true"
                >
                  {topic}
                </span>
                <BentoIcon name={icon} />
                <p id={`hint-${icon}`} className="max-w-[32ch] text-base leading-snug font-normal text-pretty wrap-anywhere lg:text-lg xl:text-xl">
                  {hint}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
