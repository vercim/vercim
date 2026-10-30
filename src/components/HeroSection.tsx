import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import { CloudShader } from '@/components/ui/cloud-shader';
import { ContactButtons } from '@/components/ui/contact-buttons';
import { TwoWorldsGround } from '@/components/ui/two-worlds-ground';

// TODO: final wording is yours; this is your draft.
const HERO_PHRASE = 'Work freely, on the same vibe';

const characters = [
  { id: 'minecraft', src: '/images/hero/minecraft.png', alt: 'My Minecraft character' },
  { id: 'roblox', src: '/images/hero/roblox.png', alt: 'My Roblox character' },
] as const;

function publicFileExists(src: string) {
  return existsSync(join(process.cwd(), 'public', src));
}

export function HeroSection() {
  const groundSrc = '/images/hero/ground.png';

  return (
    <section className="hero">
      <div className="hero__sky" aria-hidden="true">
        <CloudShader />
      </div>

      <div className="hero__content">
        <h1 className="hero__phrase">{HERO_PHRASE}</h1>
        <ContactButtons />
      </div>

      <div className="hero__ground">
        {publicFileExists(groundSrc) ? (
          <Image className="hero__ground-image" src={groundSrc} alt="" fill sizes="100vw" />
        ) : (
          <TwoWorldsGround />
        )}

        {characters.map(({ id, src, alt }) => (
          <div key={id} className={`hero__character hero__character--${id}`}>
            {publicFileExists(src) ? (
              <Image src={src} alt={alt} fill sizes="(max-width: 680px) 40vw, 24vw" />
            ) : (
              <span className="hero__character-placeholder">{src}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
