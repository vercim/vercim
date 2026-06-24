'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Eye, ThumbsUp } from 'lucide-react';
import type { YouTubeVideoItem } from '@/lib/youtube';

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
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-2 max-[400px]:grid-cols-1">
        {visible.map((v) => (
          <a
            key={v.videoId}
            href={`https://www.youtube.com/watch?v=${v.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 no-underline text-inherit min-w-0"
          >
            <div className="relative w-full aspect-video overflow-hidden bg-surface border border-divider">
              <Image
                src={`https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg`}
                alt=""
                fill
                className="object-cover transition-[opacity,filter] duration-150 group-hover:opacity-80 group-hover:blur-[3px]"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
                <div className="w-9 h-9 flex items-center justify-center text-white bg-black/50">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7 7 17 7 17 17"/>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-[0.8rem] text-muted leading-[1.45] m-0 truncate transition-colors group-hover:text-fg">{v.title}</p>
            <div className="flex flex-row items-center justify-between gap-2 min-w-0">
              {v.channelLabel && (
                <span className="text-[13px] text-faint tracking-[0.02em]">{v.channelLabel}</span>
              )}
              {(v.viewCount !== undefined || v.likeCount !== undefined) && (
                <div className="flex gap-3">
                  {v.viewCount !== undefined && (
                    <span className="flex items-center gap-[0.25rem] text-[0.75rem] text-ghost tracking-[0.02em] transition-colors group-hover:text-subtle">
                      <Eye size={15} strokeWidth={1} style={{ fill: 'currentColor', stroke: 'var(--c-bg)' }} />
                      {formatCount(v.viewCount)}
                    </span>
                  )}
                  {v.likeCount !== undefined && (
                    <span className="flex items-center gap-[0.25rem] text-[0.75rem] text-ghost tracking-[0.02em] transition-colors group-hover:text-subtle">
                      <ThumbsUp size={15} strokeWidth={1} style={{ fill: 'currentColor', stroke: 'var(--c-bg)' }} />
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
          className="group block w-full max-w-[680px] mx-auto px-4 py-[0.6rem] bg-transparent border border-line-soft text-subtle text-[0.75rem] uppercase tracking-[0.05em] cursor-pointer transition-colors hover:text-fg hover:border-line-bright"
          onClick={() => setCount((c) => c + loadMoreCount)}
        >
          <span className="relative after:absolute after:left-0 after:bottom-[-1px] after:w-full after:h-px after:bg-current after:scale-x-0 after:origin-left after:transition-transform group-hover:after:scale-x-100">
            load more
          </span>
        </button>
      )}
    </div>
  );
}
