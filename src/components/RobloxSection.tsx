import { ArtSlot } from '@/components/ui/art-slot';
import { RevealText } from '@/components/ui/reveal-text';
import { SectionIcons } from '@/components/ui/section-icons';

const robloxIcons = [
  { title: 'Roblox', iconUrl: '/roblox.png' },
  { title: 'Roblox Studio', iconUrl: '/roblox-studio.png' },
];

export function RobloxSection() {
  return (
    <div className="flow-root bg-linear-to-b/srgb from-frame to-dark">
      <section
        id="games"
        className="showcase framed-section roblox-showcase"
        aria-labelledby="games-title"
        data-reveal
      >
        <div className="showcase-copy">
          <SectionIcons icons={robloxIcons} unoptimized />

          <RevealText as="h2" id="games-title" className="display-type text-balance" delay={0.15}>
            Roblox development
          </RevealText>

          <RevealText className="paragraph-copy" delay={0.25}>
            I build games in Roblox Studio with Luau. I make animations in Blender, design the
            interfaces players use, and work on the systems that keep the game running when
            something goes wrong.
          </RevealText>
        </div>

        <ArtSlot
          parallax="roblox"
          src="/char_rbx.png"
          alt="My Roblox character"
          sizes="(width < 42.5rem) min(calc(100vw - 1rem), 70dvh), 50vw"
          width={2069}
          height={1495}
        />
      </section>
    </div>
  );
}
