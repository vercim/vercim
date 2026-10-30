import type { CSSProperties } from 'react';
import { CloudShader } from '@/components/ui/cloud-shader';
import { ContactList } from '@/components/ui/contact-list';
import { contacts } from '@/data/social';

export function HeroSection() {
  return (
    <section id="contacts" className="hero">
      <div className="hero__sky" aria-hidden="true">
        <CloudShader />
      </div>

      <ContactList contacts={contacts} />
      <h1
        className="hero__phrase hero-reveal"
        style={{ '--reveal-delay': `${contacts.length * 0.1 + 0.15}s` } as CSSProperties}
      >
        <span className="hero-reveal__line">work on the same vibe ;)</span>
      </h1>
    </section>
  );
}
