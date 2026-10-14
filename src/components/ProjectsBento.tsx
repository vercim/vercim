import type { CSSProperties } from 'react';
import { createBentoLayout } from '@/lib/bentoLayout';
import type { RepoCard } from '@/types/project';
import { ProjectCard } from './ProjectCard';

// Cards arrive most recently pushed first; the first one gets the large tile.
export function ProjectsBento({ cards }: { cards: RepoCard[] }) {
  const layout = createBentoLayout(cards.length);
  const gridStyle = {
    '--desktop-columns': layout.columns,
    '--desktop-rows': layout.rows,
  } as CSSProperties;

  return (
    <div className="projects-grid" style={gridStyle}>
      {cards.map((card, index) => (
        <ProjectCard
          key={card.fullName}
          project={card}
          index={index}
          featured={index === 0}
          desktopPlacement={layout.placements[index]}
        />
      ))}
    </div>
  );
}
