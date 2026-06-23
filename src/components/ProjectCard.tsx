'use client';

import type { RepoCard } from '@/types/project';
import { YouTubeEmbed } from './YouTubeEmbed';
import { SiGithub } from 'react-icons/si';
import { HiOutlineArrowDownTray } from 'react-icons/hi2';
import styles from './ProjectCard.module.css';

interface Props {
  project: RepoCard;
}

export function ProjectCard({ project }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.row}>
        <div className={styles.info}>
          <h2 className={`${styles.name}${project.pinned ? ` ${styles.namePinned}` : ''}`}>
            {project.name}
          </h2>
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
              <HiOutlineArrowDownTray size={16} />
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
