'use client';

import type { CSSProperties, PointerEvent } from 'react';
import { Dithering } from '@paper-design/shaders-react';
import { ArrowUpRight } from 'lucide-react';
import { LanguageBar } from '@/components/LanguageBar';
import type { BentoPlacement } from '@/lib/bentoLayout';
import type { RepoCard } from '@/types/project';

interface Props {
  project: RepoCard;
  index: number;
  featured?: boolean;
  desktopPlacement?: BentoPlacement;
}

function placementStyle(placement?: BentoPlacement) {
  if (!placement) return undefined;

  return {
    '--desktop-column': placement.column,
    '--desktop-row': placement.row,
    '--desktop-column-span': placement.columnSpan,
    '--desktop-row-span': placement.rowSpan,
  } as CSSProperties;
}

// Feeds the cursor position to the hover spotlight; touch input has no hover state.
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return;

  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
}

export function ProjectCard({ project, index, featured = false, desktopPlacement }: Props) {
  const name = project.fullName.slice(project.fullName.indexOf('/') + 1);

  return (
    <article
      style={placementStyle(desktopPlacement)}
      className={`project-card${featured ? ' project-card--featured' : ''}`}
      onPointerMove={trackPointer}
    >
      {featured && (
        <div className="project-card__shader" aria-hidden="true">
          <Dithering
            shape="sphere"
            type="random"
            colorBack="#ffffff00"
            // Same orange as --c-ticket; the shader needs a literal color.
            colorFront="#ef681c"
            size={1.35}
            speed={0.65}
            scale={0.75}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      <div className="project-card__meta">
        <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>
        <ArrowUpRight className="project-card__arrow" aria-hidden="true" />
      </div>

      <div className="project-card__body">
        <h3 className="project-card__name">
          <a
            className="project-card__link"
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.fullName} source code on GitHub`}
          >
            {name}
          </a>
        </h3>
        {project.description && (
          <p className="project-card__description">{project.description}</p>
        )}
      </div>

      <LanguageBar languages={project.languages} />
    </article>
  );
}
