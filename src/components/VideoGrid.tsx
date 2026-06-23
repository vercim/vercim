'use client';

import { useState } from 'react';
import type { YouTubeVideoItem } from '@/lib/youtube';
import styles from './VideoGrid.module.css';

interface Props {
  videos: YouTubeVideoItem[];
  initialCount: number;
  loadMoreCount: number;
}

export function VideoGrid({ videos, initialCount, loadMoreCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const visible = videos.slice(0, count);
  const hasMore = count < videos.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {visible.map((v) => (
          <a
            key={v.videoId}
            href={`https://www.youtube.com/watch?v=${v.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.thumb}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                alt=""
                className={styles.img}
              />
            </div>
            <p className={styles.title}>{v.title}</p>
            {v.channelLabel && (
              <span className={styles.channel}>{v.channelLabel}</span>
            )}
          </a>
        ))}
      </div>

      {hasMore && (
        <button
          className={styles.more}
          onClick={() => setCount((c) => c + loadMoreCount)}
        >
          load more
        </button>
      )}
    </div>
  );
}
