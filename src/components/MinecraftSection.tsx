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
    <section
      id="mods"
      className="relative grid min-h-svh grid-cols-[minmax(0,1fr)_min(60dvh,34vw)] gap-[clamp(2rem,5vw,5rem)] pt-[clamp(1rem,4vh,2rem)] pr-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,7vw,7rem))] pl-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] max-[680px]:grid-cols-1 max-[680px]:gap-8 max-[680px]:pr-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,9vw,9rem))] max-[680px]:pb-[min(158%,70dvh)]"
      aria-label="Minecraft mods"
      data-reveal
    >
      <div className="relative z-1 mt-[clamp(6rem,14vh,10rem)] flex flex-col self-start justify-self-center gap-[clamp(1rem,3vh,1.5rem)] max-[680px]:mt-0 max-[680px]:w-full max-[680px]:justify-self-start">
        {totalDownloads !== null ? (
          <p className="m-0 text-[clamp(1.75rem,4.8vw,4.75rem)] leading-[1.05] tracking-[-0.045em] text-balance text-ink-soft">
            <span className="reveal block font-semibold text-ink">
              <span className="reveal__line">{formatCount.format(totalDownloads)}</span>
            </span>{' '}
            <span className="reveal" style={{ '--reveal-delay': '0.1s' } as CSSProperties}>
              <span className="reveal__line">downloads</span>
            </span>
          </p>
        ) : null}

        {iconProjects.length > 0 ? (
          <ul className="m-0 flex list-none flex-wrap gap-[clamp(0.75rem,1.5vw,1.25rem)] p-0">
            {iconProjects.map(({ title, iconUrl }, index) => (
              <li
                key={title}
                className="reveal__fade w-[clamp(3.5rem,7vw,6rem)]"
                style={{ '--reveal-delay': `${0.25 + index * 0.08}s` } as CSSProperties}
              >
                <Image
                  className="block aspect-square h-auto w-full rounded-xl"
                  src={iconUrl}
                  alt={title}
                  width={100}
                  height={100}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <p
        className="reveal absolute top-[65%] left-[28%] z-1 m-0 w-[clamp(18rem,28vw,28rem)] text-[clamp(1.25rem,2vw,2rem)] leading-[1.15] tracking-[-0.035em] text-balance text-ink-soft max-[680px]:static max-[680px]:mt-0 max-[680px]:w-auto max-[680px]:max-w-none"
        style={{ '--reveal-delay': '0.5s' } as CSSProperties}
      >
        <span className="reveal__line">
          high quality mods with a full workflow, <br className="max-[680px]:hidden" /> right down
          to discord notifications
        </span>
      </p>

      <ArtSlot
        className="reveal__fade pointer-events-none absolute right-[calc(clamp(0.5rem,1.4vw,1.25rem)_+_clamp(1.5rem,7vw,7rem))] bottom-0 w-[min(60dvh,34vw)] max-[680px]:right-0 max-[680px]:left-0 max-[680px]:mx-auto max-[680px]:w-[min(100%,44dvh)]"
        cut
        src="/char_mc.png"
        alt="My Minecraft character"
        sizes="(max-width: 680px) 85vw, 45vw"
        width={1175}
        height={1855}
      />
    </section>
  );
}
