import type { CSSProperties } from 'react';
import { config } from '@/data/config';
import { fetchRepoLanguages, fetchRepos } from '@/lib/github';
import type { RepoCard } from '@/types/project';
import { ProjectCard, type BentoPlacement } from './ProjectCard';

interface BentoLayout {
  columns: number;
  rows: number;
  placements: BentoPlacement[];
}

const DESKTOP_SHAPES = [
  [2, 2],
  [2, 1],
  [1, 2],
  [2, 1],
  [1, 2],
] as const;

const MOBILE_SHAPES = [
  [2, 1],
  [1, 2],
  [1, 1],
] as const;

function createBentoLayout(
  count: number,
  columns: number,
  density: number,
  shapes: ReadonlyArray<readonly [number, number]>
): BentoLayout {
  if (count === 0) {
    return { columns: 1, rows: 1, placements: [] };
  }

  const rows = Math.max(1, Math.ceil((count * density) / columns));
  const occupied = Array.from({ length: rows }, () => Array(columns).fill(false));
  const placements: BentoPlacement[] = [];
  let usedCells = 0;

  const findSpace = (columnSpan: number, rowSpan: number) => {
    for (let row = 0; row <= rows - rowSpan; row += 1) {
      for (let column = 0; column <= columns - columnSpan; column += 1) {
        const available = Array.from({ length: rowSpan }, (_, rowOffset) =>
          Array.from(
            { length: columnSpan },
            (_, columnOffset) => !occupied[row + rowOffset][column + columnOffset]
          ).every(Boolean)
        ).every(Boolean);

        if (available) return { column, row };
      }
    }

    return null;
  };

  for (let index = 0; index < count; index += 1) {
    const remainingCards = count - index - 1;
    const preferredShape = shapes[index % shapes.length];
    const candidates = [preferredShape, [1, 1] as const];

    for (const [columnSpan, rowSpan] of candidates) {
      const area = columnSpan * rowSpan;
      const freeCellsAfterPlacement = columns * rows - usedCells - area;
      if (freeCellsAfterPlacement < remainingCards) continue;

      const space = findSpace(columnSpan, rowSpan);
      if (!space) continue;

      for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
        for (let columnOffset = 0; columnOffset < columnSpan; columnOffset += 1) {
          occupied[space.row + rowOffset][space.column + columnOffset] = true;
        }
      }

      usedCells += area;
      placements.push({
        column: space.column + 1,
        row: space.row + 1,
        columnSpan,
        rowSpan,
      });
      break;
    }
  }

  return { columns, rows, placements };
}

export async function ProjectsSection() {
  const repos = await fetchRepos(config.githubUsername);
  const cards: RepoCard[] = await Promise.all(
    repos.map(async (repo) => {
      const languages = await fetchRepoLanguages(repo);

      return {
        fullName: repo.full_name,
        description: repo.description,
        sourceUrl: repo.html_url,
        languages,
      };
    })
  );

  const desktopColumns = Math.max(1, Math.ceil(Math.sqrt(cards.length * 2)));
  const mobileColumns = Math.min(2, Math.max(1, cards.length));
  const desktopLayout = createBentoLayout(cards.length, desktopColumns, 1.6, DESKTOP_SHAPES);
  const mobileLayout = createBentoLayout(cards.length, mobileColumns, 1.25, MOBILE_SHAPES);
  const largestProjectIndex = desktopLayout.placements.reduce((largestIndex, placement, index) => {
    const largestPlacement = desktopLayout.placements[largestIndex];
    const area = placement.columnSpan * placement.rowSpan;
    const largestArea = largestPlacement.columnSpan * largestPlacement.rowSpan;
    return area > largestArea ? index : largestIndex;
  }, 0);
  const gridStyle = {
    '--desktop-columns': desktopLayout.columns,
    '--desktop-rows': desktopLayout.rows,
    '--mobile-columns': mobileLayout.columns,
    '--mobile-rows': mobileLayout.rows,
  } as CSSProperties;

  return (
    <section id="projects" className="projects-section py-42">
      <div className="projects-section__inner">
        {cards.length > 0 && (
          <div className="projects-grid" style={gridStyle}>
            {cards.map((card, index) => (
              <ProjectCard
                key={card.fullName}
                project={card}
                desktopPlacement={desktopLayout.placements[index]}
                mobilePlacement={mobileLayout.placements[index]}
                showShader={index === largestProjectIndex}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
