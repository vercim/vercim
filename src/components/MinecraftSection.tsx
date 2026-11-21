import { ArtSlot } from '@/components/ui/art-slot';
import { RevealText } from '@/components/ui/reveal-text';
import { SectionIcons } from '@/components/ui/section-icons';
import { modAccounts } from '@/data/social';
import { fetchModsOverview } from '@/lib/mods';

export async function MinecraftSection() {
  const { projects } = await fetchModsOverview(modAccounts);
  const icons = projects.flatMap(({ title, iconUrl, link }) => (
    iconUrl ? [{ title, iconUrl, link }] : []
  ));

  return (
    <section
      id="mods"
      className="showcase minecraft-showcase page-gutters overflow-hidden max-desktop:gap-12"
      aria-labelledby="mods-title"
      data-reveal
    >
      <div className="showcase-copy text-black">
        <SectionIcons icons={icons} />

        <RevealText as="h2" id="mods-title" className="display-type text-balance" delay={0.1}>
          Minecraft modding
        </RevealText>

        <RevealText className="paragraph-copy" delay={0.25}>
          My release workflow automatically builds, publishes, and notifies users. 
          I use modern tools for multiloader and muliversional development, and i 
          also provide full documentation, which makes it easier to release future updates.
        </RevealText>
      </div>

      <ArtSlot
        parallax="minecraft"
        src="/char_mc.png"
        alt="My Minecraft character"
        sizes="(width < 42.5rem) min(100vw, 44svh), min(60svh, 34vw)"
        width={1175}
        height={1855}
      />
    </section>
  );
}
