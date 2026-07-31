export interface DiscordProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl: string | null;
  accentColor: string | null;
  profileUrl: string;
}

export type DiscordProfileResult =
  | {
      status: 'success';
      profile: DiscordProfile;
    }
  | {
      status: 'error';
      message: string;
    };

interface DiscordUserResponse {
  id?: string;
  username?: string;
  discriminator?: string;
  global_name?: string | null;
  avatar?: string | null;
  banner?: string | null;
  accent_color?: number | null;
}

function getDefaultAvatarIndex(id: string, discriminator: string | undefined) {
  if (discriminator && discriminator !== '0') {
    return Number(discriminator) % 5;
  }

  return Number((BigInt(id) >> BigInt(22)) % BigInt(6));
}

function toHexColor(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `#${value.toString(16).padStart(6, '0')}`;
}

export async function fetchDiscordProfile(userId: string): Promise<DiscordProfileResult> {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    return {
      status: 'error',
      message: 'Discord bot token is not configured',
    };
  }

  try {
    const res = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      next: { revalidate: 21600 },
    });

    if (!res.ok) {
      console.error('[discord] profile HTTP error:', res.status);
      return {
        status: 'error',
        message: `Discord API returned ${res.status}`,
      };
    }

    const user: DiscordUserResponse = await res.json();

    if (!user.id || !user.username) {
      return {
        status: 'error',
        message: 'Discord profile data is incomplete',
      };
    }

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`
      : `https://cdn.discordapp.com/embed/avatars/${getDefaultAvatarIndex(user.id, user.discriminator)}.png`;
    const bannerUrl = user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.webp?size=1024`
      : null;

    return {
      status: 'success',
      profile: {
        id: user.id,
        name: user.global_name ?? user.username,
        handle: `@${user.username}`,
        avatarUrl,
        bannerUrl,
        accentColor: toHexColor(user.accent_color),
        profileUrl: `https://discord.com/users/${user.id}`,
      },
    };
  } catch (error) {
    console.error('[discord] profile exception:', error);
    return {
      status: 'error',
      message: 'Could not reach Discord API',
    };
  }
}
