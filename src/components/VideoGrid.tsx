'use client';

import { useState } from 'react';
import type { YouTubeVideoItem } from '@/lib/youtube';
import styles from './VideoGrid.module.css';

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

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
            <div className={styles.meta}>
              {v.channelLabel && (
                <span className={styles.channel}>{v.channelLabel}</span>
              )}
              {(v.viewCount !== undefined || v.likeCount !== undefined) && (
                <div className={styles.stats}>
                  {v.viewCount !== undefined && (
                    <span className={styles.stat}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      {formatCount(v.viewCount)}
                    </span>
                  )}
                  {v.likeCount !== undefined && (
                    <span className={styles.stat}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                      </svg>
                      {formatCount(v.likeCount)}
                    </span>
                  )}
                </div>
              )}
            </div>
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
