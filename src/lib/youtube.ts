export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  published: string;
  channelLabel?: string;
  viewCount?: number;
  likeCount?: number;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseRSS(xml: string, channelLabel?: string): YouTubeVideoItem[] {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  return entries
    .map((m) => {
      const c = m[1];
      const videoId = c.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? '';
      const rawTitle = c.match(/<title>(.*?)<\/title>/)?.[1] ?? '';
      const published = c.match(/<published>(.*?)<\/published>/)?.[1] ?? '';
      return { videoId, title: decodeEntities(rawTitle), published, channelLabel };
    })
    .filter((v) => v.videoId !== '');
}

export async function enrichWithStats(
  videos: YouTubeVideoItem[],
  apiKey: string
): Promise<YouTubeVideoItem[]> {
  const statsMap = new Map<string, { viewCount: number; likeCount: number }>();

  for (let i = 0; i < videos.length; i += 50) {
    const ids = videos.slice(i, i + 50).map((v) => v.videoId).join(',');
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${apiKey}`,
        { next: { revalidate: 21600 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const item of data.items ?? []) {
        statsMap.set(item.id, {
          viewCount: parseInt(item.statistics.viewCount ?? '0', 10),
          likeCount: parseInt(item.statistics.likeCount ?? '0', 10),
        });
      }
    } catch { }
  }

  return videos.map((v) => ({ ...v, ...statsMap.get(v.videoId) }));
}

export async function fetchChannelVideos(
  channelId: string,
  channelLabel?: string
): Promise<YouTubeVideoItem[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const label = channelLabel ?? xml.match(/<author>\s*<name>(.*?)<\/name>/s)?.[1]?.trim();
    return parseRSS(xml, label);
  } catch {
    return [];
  }
}
