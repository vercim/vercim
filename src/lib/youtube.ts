export interface YouTubeVideoItem {
  videoId: string;
  title: string;
  published: string;
  channelLabel?: string;
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

export async function fetchChannelVideos(
  channelId: string,
  channelLabel?: string
): Promise<YouTubeVideoItem[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { cache: 'force-cache' }
    );
    if (!res.ok) return [];
    return parseRSS(await res.text(), channelLabel);
  } catch {
    return [];
  }
}
