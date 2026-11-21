import { BentoIcon, type BentoIconName } from '@/components/ui/bento-icon';

const facts: { icon: BentoIconName; topic: string; hint: string }[] = [
  {
    icon: 'mods',
    topic: 'Tech Stack',
    hint: "Two+ years as a Luau developer, experienced with backend and web development. I mainly work with Java. I've been working in video editing and motion design for many years.",
  },
  {
    icon: 'speed',
    topic: 'Delivery',
    hint: 'Rapid implementation from concept to the first MVP, idea validation, and testing.',
  },
  {
    icon: 'payment',
    topic: 'Payment',
    hint: 'I accept payment in cryptocurrency (which is the most convenient option) other options can be discussed on a case-by-case basis.',
  },
  {
    icon: 'rank',
    topic: 'Certification',
    hint: 'I have verified developer status in the Roblox Community and over 100,000 downloads of my Minecraft mods.',
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
