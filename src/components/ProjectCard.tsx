'use client';

import type { CSSProperties } from 'react';
import { Dithering } from '@paper-design/shaders-react';
import type { RepoCard } from '@/types/project';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  project: RepoCard;
  desktopPlacement: BentoPlacement;
  mobilePlacement: BentoPlacement;
  showShader: boolean;
}

export interface BentoPlacement {
  column: number;
  row: number;
  columnSpan: number;
  rowSpan: number;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Luau: '#00a2ff',
  HTML: '#e34c26',
  CSS: '#663399',
  Python: '#3572a5',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Shell: '#89e051',
  Rust: '#dea584',
  Go: '#00add8',
  Vue: '#41b883',
};

function formatPercentage(percentage: number) {
  if (percentage < 0.1) return '<0.1%';
  if (percentage >= 10) return `${Math.round(percentage)}%`;
  return `${percentage.toFixed(1)}%`;
}

export function ProjectCard({
  project,
  desktopPlacement,
  mobilePlacement,
  showShader,
}: Props) {
  const layoutStyle = {
    '--desktop-column': desktopPlacement.column,
    '--desktop-row': desktopPlacement.row,
    '--desktop-column-span': desktopPlacement.columnSpan,
    '--desktop-row-span': desktopPlacement.rowSpan,
    '--mobile-column': mobilePlacement.column,
    '--mobile-row': mobilePlacement.row,
    '--mobile-column-span': mobilePlacement.columnSpan,
    '--mobile-row-span': mobilePlacement.rowSpan,
  } as CSSProperties;
  return (
    <article
      style={layoutStyle}
      className="project-card"
    >
      {showShader && (
        <div className="project-card__shader" aria-hidden="true">
          <Dithering
            shape="sphere"
            type="random"
            colorBack="#ffffff00"
            colorFront="#000000b3"
            size={1}
            speed={0.75}
            scale={1}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <a
        className="project-card__source-link"
        href={project.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.fullName} source code on GitHub`}
      />

      <div className="project-card__heading">
        <h2>{project.fullName}</h2>
        <a
          className="project-card__github-link"
          href={project.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.fullName} source code on GitHub`}
        >
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>

      {project.description && (
        <p className="project-card__description">{project.description}</p>
      )}

      <div className="project-card__footer">
        <div className="project-card__metadata">
          {project.languages.length > 0 && (
            <ul className="project-card__languages" aria-label="Repository languages">
              {project.languages.map((language) => (
                <li
                  key={language.name}
                  style={{
                    '--language-color': LANGUAGE_COLORS[language.name] ?? '#8b949e',
                  } as CSSProperties}
                >
                  <span className="project-card__language-dot" aria-hidden="true" />
                  <span>{language.name}</span>
                  <span className="project-card__language-percentage">
                    {formatPercentage(language.percentage)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </article>
  );
}
