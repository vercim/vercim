'use client';

import type { RepoCard } from '@/types/project';
import { YouTubeEmbed } from './YouTubeEmbed';
import { SiGithub } from 'react-icons/si';
import { Download, ArrowUpRight } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import { useInView } from '@/hooks/useInView';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';

interface Props {
  project: RepoCard;
}

export function ProjectCard({ project }: Props) {
  const { ref, inView } = useInView();
  const { enabled: motionEnabled } = useMotionEnabled();
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      style={motionEnabled ? (inView ? { animation: 'slide-up-fade 0.4s ease both' } : { opacity: 0 }) : {}}
      className="w-full px-5 py-[1.125rem] border border-line bg-surface transition-colors hover:border-line-hover">
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-[0.4rem]">
          <div className="flex items-center gap-2">
            <h2 className={`text-[0.9375rem] font-semibold m-0 tracking-[-0.01em] ${project.pinned ? 'text-accent' : 'text-fg'}`}>
              {project.name}
            </h2>
            {project.stars > 0 && (
              <span className="inline-flex items-center gap-[0.25rem] text-[0.6875rem] text-accent-dim bg-raised border border-line-badge rounded-full px-[0.65em] py-[0.2em] tracking-[0.01em]">
                <FaStar size={9} />
                {project.stars}
              </span>
            )}
          </div>
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-[0.375rem]">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[0.6875rem] text-muted bg-raised border border-line-badge rounded-full px-[0.65em] py-[0.2em] tracking-[0.01em]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {project.description && (
            <p className="text-[0.8125rem] text-subtle m-0 leading-[1.55]">{project.description}</p>
          )}
        </div>

        <div className="flex flex-row gap-[0.375rem] shrink-0 pt-[0.125rem]">
          <a href={project.sourceUrl} className="flex items-center justify-center w-11 h-11 border border-line-soft text-subtle transition-colors hover:text-fg hover:border-line-bright [-webkit-tap-highlight-color:transparent]"
            target="_blank" rel="noopener noreferrer" title="Source" aria-label="Source">
            <SiGithub size={18} />
          </a>
          {project.releaseUrl && (
            <a href={project.releaseUrl} className="flex items-center justify-center w-11 h-11 border border-line-soft text-subtle transition-colors hover:text-fg hover:border-line-bright [-webkit-tap-highlight-color:transparent]"
              target="_blank" rel="noopener noreferrer" title="Download" aria-label="Download">
              <Download size={18} />
            </a>
          )}
          {project.projectUrl && (
            <a href={project.projectUrl} className="flex items-center justify-center w-11 h-11 border border-line-soft text-subtle transition-colors hover:text-fg hover:border-line-bright [-webkit-tap-highlight-color:transparent]"
              target="_blank" rel="noopener noreferrer" title="Open project" aria-label="Open project">
              <ArrowUpRight size={18} />
            </a>
          )}
        </div>
      </div>

      {project.youtubeId && (
        <div className="mt-4">
          <YouTubeEmbed videoId={project.youtubeId} />
        </div>
      )}
    </article>
  );
}
