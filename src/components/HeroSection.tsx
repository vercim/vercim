import type { ReactNode } from 'react';

import { CloudShader } from '@/components/ui/cloud-shader';
import { ContactList } from '@/components/ui/contact-list';
import { RevealText } from '@/components/ui/reveal-text';
import { contacts } from '@/data/social';

const contactMaskId = 'hero-contact-clouds';
const paragraphMaskId = 'hero-paragraph-clouds';
const maskCanvasIds = [contactMaskId, paragraphMaskId];

function HeroCloudText({ maskId, alignEnd, children }: {
  maskId: string;
  alignEnd?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={alignEnd ? 'hero-cloud-text self-end' : 'hero-cloud-text'}>
      <canvas id={maskId} aria-hidden="true" />
      {children}
      <div className="hero-cloud-text__overlay" aria-hidden="true" inert>
        {children}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section id="hero" className="framed-section hero-card text-on-sky">
      <div
        className="hero__sky absolute inset-0 -z-1 bg-linear-to-b/srgb from-sky-top to-sky-bottom"
        aria-hidden="true"
      >
        <CloudShader maskCanvasIds={maskCanvasIds} />
      </div>

      <svg className="absolute size-0" aria-hidden="true">
        <filter id="hero-cloud-text-mask" colorInterpolationFilters="sRGB">
          {/* Red uses the cloud mask as-is. Green uses its inverse. */}
          <feColorMatrix result="normal" values="0 0 1.45 0 -0.25  0 0 1.45 0 -0.25  0 0 1.45 0 -0.25  1.1 0 0 0 0" />
          <feColorMatrix in="SourceGraphic" result="selected" values="0 0 -1.45 0 1.25  0 0 -1.45 0 1.25  0 0 -1.45 0 1.25  0 1.1 0 0 0" />
          <feComposite in="normal" in2="selected" operator="arithmetic" k2={1} k3={1} />
        </filter>
      </svg>

      <HeroCloudText maskId={contactMaskId}>
        <ContactList usernames={contacts} />
      </HeroCloudText>
      <HeroCloudText maskId={paragraphMaskId} alignEnd>
        <RevealText
          className="paragraph-copy hero-copy text-right"
          delay={Object.keys(contacts).length * 0.1 + 0.15}
        >
          {'I love to make inspiring and astonishing things.\nSend me a message if u want but please be concise :)'}
        </RevealText>
      </HeroCloudText>
    </section>
  );
}
