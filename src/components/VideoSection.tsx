import { config } from '@/data/config';
import { fetchChannelVideos, enrichWithStats } from '@/lib/youtube';
import { SquarePlay } from 'lucide-react';
import { VideoGrid } from './VideoGrid';

export async function VideoSection() {
  if (config.youtubeChannels.length === 0) return null;

  const results = await Promise.all(
    config.youtubeChannels.map((ch) => fetchChannelVideos(ch.id))
  );

  const sorted = results
    .flat()
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());

  const apiKey = process.env.YOUTUBE_API_KEY;
  const enrichLimit = config.videosInitial + config.videosLoadMore * 2;
  const toEnrich = sorted.slice(0, enrichLimit);
  const rest = sorted.slice(enrichLimit);
  const enriched = apiKey ? await enrichWithStats(toEnrich, apiKey) : toEnrich;
  const videos = [...enriched, ...rest];

  return (
    <section id="videos" className="min-h-[80vh] flex flex-col items-center">
      <div className="w-full max-w-[680px] flex items-center gap-[0.625rem] px-4 pt-8 pb-6">
        <SquarePlay size={16} className="text-faint" />
        <span className="text-[0.8125rem] font-semibold text-faint tracking-[0.04em] uppercase">videos</span>
        <span className="text-[0.6875rem] font-medium text-ghost border border-line-soft px-[0.45rem] py-[0.1rem]">{videos.length} total</span>
      </div>
      <div className="w-full max-w-[680px] px-4 pb-8">
        {videos.length === 0 ? (
          <p className="text-[0.8125rem] text-ghost py-8">no videos found</p>
        ) : (
          <VideoGrid videos={videos} initialCount={config.videosInitial} loadMoreCount={config.videosLoadMore} />
        )}
      </div>
    </section>
  );
}
