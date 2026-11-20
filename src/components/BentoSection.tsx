import { BentoIcon } from '@/components/ui/bento-icon';
import { FactAccordion } from '@/components/ui/fact-accordion';

export function BentoSection() {
  return (
    <section
      id="about"
      className="page-gutters flex items-center bg-dark py-14 text-on-dark desktop:min-h-svh desktop:py-20"
      aria-labelledby="about-title"
      data-reveal
    >
      <div className="bento-layout">
        <div className="flex min-w-0 flex-col items-start gap-5" data-bento-card>
          <div className="reveal__fade w-16 lg:w-20">
            <BentoIcon name="chat" />
          </div>
          <h2 id="about-title" className="display-type max-w-[12ch] text-balance">
            <span className="reveal"><span className="reveal__line">Let’s get down to business</span></span>
          </h2>
          <p className="paragraph-copy text-[var(--c-on-dark-muted)]">
            <span className="reveal">
              <span className="reveal__line">
                Have a Minecraft mod or a Roblox game in mind? Send me a short note about
                what you want players to be able to do.
              </span>
            </span>
          </p>
        </div>
        <FactAccordion />
      </div>
    </section>
  );
}
