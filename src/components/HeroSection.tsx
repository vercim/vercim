import type { CSSProperties } from 'react';
import { CloudShader } from '@/components/ui/cloud-shader';
import { ContactList } from '@/components/ui/contact-list';
import { contacts } from '@/data/social';

export function HeroSection() {
  return (
    <section
      id="contacts"
      className="relative isolate mx-[clamp(0.5rem,1.4vw,1.25rem)] mb-[clamp(0.5rem,1.4vw,1.25rem)] flex min-h-[max(28rem,calc(100svh_-_3.75rem_-_clamp(0.5rem,1.4vw,1.25rem)))] scroll-mt-15 flex-col justify-between gap-12 overflow-hidden rounded-[clamp(1.25rem,2.4vw,2.25rem)] pt-[clamp(2.5rem,13vh,9rem)] pr-[clamp(1.5rem,7vw,7rem)] pb-[clamp(3rem,15vh,10rem)] pl-[clamp(1.5rem,9vw,9rem)] [--reveal-base:0.5s] [clip-path:inset(0_round_clamp(1.25rem,2.4vw,2.25rem))]"
    >
      <div
        className="hero__sky absolute inset-0 -z-1 [background:linear-gradient(to_bottom,var(--c-sky-top),var(--c-sky-bottom))]"
        aria-hidden="true"
      >
        <CloudShader />
      </div>

      <ContactList contacts={contacts} />
      <h1
        className="reveal m-0 self-end origin-bottom-right -rotate-3 text-right text-[clamp(1.75rem,4.8vw,4.75rem)] font-semibold leading-none tracking-[-0.045em] text-balance text-ink mix-blend-overlay"
        style={{ '--reveal-delay': `${contacts.length * 0.1 + 0.15}s` } as CSSProperties}
      >
        <span className="reveal__line">work on the same vibe ;)</span>
      </h1>
    </section>
  );
}
