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
    <section id="minecraft" className="minecraft" aria-label="Minecraft mods">
      <div className="minecraft__stats">
        {totalDownloads !== null ? (
          <p className="minecraft__headline">
            <span className="minecraft__count">{formatCount.format(totalDownloads)}</span>{' '}
            downloads i have in total
          </p>
        ) : null}

        {iconProjects.length > 0 ? (
          <ul className="minecraft__mods">
            {iconProjects.map(({ title, iconUrl }) => (
              <li key={title} className="minecraft__mod">
                <Image className="minecraft__icon" src={iconUrl} alt={title} width={160} height={160} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ArtSlot
        className="minecraft__character"
        src="/images/minecraft/character.png"
        alt="My Minecraft character"
        sizes="(max-width: 680px) 85vw, 45vw"
      />
    </section>
  );
}
