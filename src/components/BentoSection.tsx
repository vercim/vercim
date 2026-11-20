import { FactAccordion } from '@/components/ui/fact-accordion';
import { RevealText } from '@/components/ui/reveal-text';

export function BentoSection() {
  return (
    <section
      id="about"
      className="page-gutters flex items-center bg-dark py-14 text-on-dark desktop:min-h-svh desktop:py-20"
      aria-labelledby="about-title"
      data-reveal
    >
      <div className="bento-layout">
        <div className="flex min-w-0 flex-col items-start gap-5">
          <RevealText as="h2" id="about-title" className="display-type max-w-[12ch] text-balance">
            Let’s get down to business
          </RevealText>
          <RevealText className="paragraph-copy">
            Have a Minecraft mod or a Roblox game in mind? Send me a short note about
            what you want players to be able to do.
          </RevealText>
        </div>
        <FactAccordion />
      </div>
    </section>
  );
}
