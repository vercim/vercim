import Image from 'next/image';
import { ArtSlot } from '@/components/ui/art-slot';
import { modAccounts } from '@/data/social';
import { fetchModsOverview } from '@/lib/mods';

const formatCount = new Intl.NumberFormat('en-US');

export async function MinecraftSection() {
  const { totalDownloads, projects } = await fetchModsOverview(modAccounts);
  const iconProjects = projects.filter(
    (project): project is typeof project & { iconUrl: string } => project.iconUrl !== null,
  );

  return (
    <section className="minecraft" aria-label="Minecraft mods">
      <ArtSlot
        className="minecraft__character"
        src="/images/minecraft/character.png"
        alt="My Minecraft character"
        sizes="(max-width: 680px) 60vw, 30vw"
      />

      <div className="minecraft__stats">
        {iconProjects.length > 0 ? (
          <ul className="minecraft__icons">
            {iconProjects.map(({ title, iconUrl }) => (
              <li key={title}>
                <Image className="minecraft__icon" src={iconUrl} alt={title} width={136} height={136} />
              </li>
            ))}
          </ul>
        ) : null}

        {totalDownloads !== null ? (
          <p className="minecraft__downloads">
            <span className="minecraft__count">{formatCount.format(totalDownloads)}</span>
            downloads
          </p>
        ) : null}
      </div>
    </section>
  );
}
