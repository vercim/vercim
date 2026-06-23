import { config } from '@/data/config';
import { fetchChannelVideos, enrichWithStats } from '@/lib/youtube';
import { SquarePlay } from 'lucide-react';
import { VideoGrid } from './VideoGrid';
import styles from './VideoSection.module.css';

export async function VideoSection() {
  if (config.youtubeChannels.length === 0) return null;

  const results = await Promise.all(
    config.youtubeChannels.map((ch) => fetchChannelVideos(ch.id, ch.label))
  );

  const sorted = results
    .flat()
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  const apiKey = process.env.YOUTUBE_API_KEY;
  const videos = apiKey ? await enrichWithStats(sorted, apiKey) : sorted;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <SquarePlay size={16} color="#444" />
        <span className={styles.title}>videos</span>
        <span className={styles.count}>{videos.length} total</span>
      </div>
      <div className={styles.list}>
        <div className={styles.inner}>
          {videos.length === 0 ? (
            <p className={styles.empty}>no videos found</p>
          ) : (
            <VideoGrid videos={videos} initialCount={config.videosInitial} loadMoreCount={config.videosLoadMore} />
          )}
        </div>
      </div>
    </section>
  );
}
