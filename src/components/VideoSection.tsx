import { config } from '@/data/config';
import { fetchChannelVideos } from '@/lib/youtube';
import { VideoGrid } from './VideoGrid';
import styles from './VideoSection.module.css';

export async function VideoSection() {
  if (config.youtubeChannels.length === 0) return null;

  const results = await Promise.all(
    config.youtubeChannels.map((ch) => fetchChannelVideos(ch.id, ch.label))
  );

  const videos = results
    .flat()
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>videos</span>
        <span className={styles.count}>{videos.length}</span>
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
