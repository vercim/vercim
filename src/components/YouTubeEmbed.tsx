'use client';

import { useState } from 'react';
import styles from './YouTubeEmbed.module.css';

interface Props {
  videoId: string;
}

export function YouTubeEmbed({ videoId }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={styles.wrapper}>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      className={styles.thumbnail}
      onClick={() => setPlaying(true)}
      aria-label="Play video"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt="Video thumbnail"
        className={styles.image}
      />
      <div className={styles.overlay}>
        <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </button>
  );
}
