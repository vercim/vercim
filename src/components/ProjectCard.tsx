'use client';

import type { RepoCard } from '@/types/project';
import { YouTubeEmbed } from './YouTubeEmbed';
import { SiGithub } from 'react-icons/si';
import { Download, ArrowUpRight } from 'lucide-react';
import { FaStar } from 'react-icons/fa';
import styles from './ProjectCard.module.css';

interface Props {
  project: RepoCard;
}

export function ProjectCard({ project }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.row}>
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <h2 className={`${styles.name}${project.pinned ? ` ${styles.namePinned}` : ''}`}>
              {project.name}
            </h2>
            {project.stars > 0 && (
              <span className={styles.stars}>
                <FaStar size={9} />
                {project.stars}
              </span>
            )}
          </div>
          {project.tags.length > 0 && (
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {project.description && (
            <p className={styles.description}>{project.description}</p>
          )}
        </div>

        <div className={styles.actions}>
          <a
            href={project.sourceUrl}
            className={styles.button}
            target="_blank"
            rel="noopener noreferrer"
            title="Source"
            aria-label="Source"
          >
            <SiGithub size={16} />
          </a>
          {project.releaseUrl && (
            <a
              href={project.releaseUrl}
              className={styles.button}
              target="_blank"
              rel="noopener noreferrer"
              title="Download"
              aria-label="Download"
            >
              <Download size={16} />
            </a>
          )}
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              className={styles.button}
              target="_blank"
              rel="noopener noreferrer"
              title="Open project"
              aria-label="Open project"
            >
              <ArrowUpRight size={16}/>
            </a>
          )}
        </div>
      </div>

      {project.youtubeId && (
        <div className={styles.video}>
          <YouTubeEmbed videoId={project.youtubeId} />
        </div>
      )}
    </article>
  );
}
