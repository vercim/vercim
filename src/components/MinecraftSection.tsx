import Image from 'next/image';
import type { CSSProperties } from 'react';
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
    <section id="mods" className="minecraft" aria-label="Minecraft mods" data-reveal>
      <div className="minecraft__stats">
        {totalDownloads !== null ? (
          <p className="minecraft__headline">
            <span className="minecraft__count reveal">
              <span className="reveal__line">{formatCount.format(totalDownloads)}</span>
            </span>{' '}
            <span className="reveal" style={{ '--reveal-delay': '0.1s' } as CSSProperties}>
              <span className="reveal__line">downloads i have in total</span>
            </span>
          </p>
        ) : null}

        {iconProjects.length > 0 ? (
          <ul className="minecraft__mods">
            {iconProjects.map(({ title, iconUrl }, index) => (
              <li
                key={title}
                className="minecraft__mod reveal__fade"
                style={{ '--reveal-delay': `${0.25 + index * 0.08}s` } as CSSProperties}
              >
                <Image className="minecraft__icon" src={iconUrl} alt={title} width={100} height={100} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ArtSlot
        className="minecraft__character art-slot--cut reveal__fade"
        src="/char_mc.png"
        alt="My Minecraft character"
        sizes="(max-width: 680px) 85vw, 45vw"
        width={1175}
        height={1855}
      />
    </section>
  );
}
