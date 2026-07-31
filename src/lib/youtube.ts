export interface YouTubeChannel {
  name: string;
  handle: string;
  subscribers: number | null;
  views: number;
  avatarUrl: string;
  bannerUrl: string;
}

export type YouTubeChannelResult =
  | {
      status: 'success';
      channel: YouTubeChannel;
    }
  | {
      status: 'error';
      message: string;
    };

interface YouTubeChannelResponse {
  items?: {
    snippet: {
      title: string;
      customUrl?: string;
      thumbnails: {
        default?: {
          url: string;
        };
        medium?: {
          url: string;
        };
        high?: {
          url: string;
        };
      };
    };
    statistics: {
      viewCount: string;
      subscriberCount?: string;
      hiddenSubscriberCount: boolean;
    };
    brandingSettings: {
      image?: {
        bannerExternalUrl?: string;
      };
    };
  }[];
}

export async function fetchYouTubeChannel(handle: string): Promise<YouTubeChannelResult> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return {
      status: 'error',
      message: 'YouTube API key is not configured',
    };
  }

  const params = new URLSearchParams({
    part: 'snippet,statistics,brandingSettings',
    forHandle: handle,
    key: apiKey,
  });

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`, {
      next: { revalidate: 21600 },
    });

    if (!res.ok) {
      console.error('[youtube] channel HTTP error:', res.status);
      return {
        status: 'error',
        message: `YouTube API returned ${res.status}`,
      };
    }

    const payload: YouTubeChannelResponse = await res.json();
    const channel = payload.items?.[0];

    if (!channel) {
      return {
        status: 'error',
        message: 'YouTube channel was not found',
      };
    }

    const avatarUrl =
      channel.snippet.thumbnails.high?.url ??
      channel.snippet.thumbnails.medium?.url ??
      channel.snippet.thumbnails.default?.url;
    const bannerUrl = channel.brandingSettings.image?.bannerExternalUrl;
    const views = Number(channel.statistics.viewCount);
    const subscribers = channel.statistics.hiddenSubscriberCount
      ? null
      : Number(channel.statistics.subscriberCount);

    if (!avatarUrl || !bannerUrl || !Number.isFinite(views)) {
      return {
        status: 'error',
        message: 'YouTube channel data is incomplete',
      };
    }

    if (subscribers !== null && !Number.isFinite(subscribers)) {
      return {
        status: 'error',
        message: 'YouTube subscriber data is unavailable',
      };
    }

    return {
      status: 'success',
      channel: {
        name: channel.snippet.title,
        handle: channel.snippet.customUrl ?? handle,
        subscribers,
        views,
        avatarUrl,
        bannerUrl,
      },
    };
  } catch (error) {
    console.error('[youtube] channel exception:', error);
    return {
      status: 'error',
      message: 'Could not reach YouTube API',
    };
  }
}
