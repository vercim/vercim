import { HeroSection } from '@/components/HeroSection';
import { config } from '@/data/config';
import { fetchCurseForgeStats } from '@/lib/curseforge';
import { fetchDiscordProfile } from '@/lib/discord';
import { fetchGitHubContributions } from '@/lib/github';
import { fetchModrinthStats } from '@/lib/modrinth';
import { fetchYouTubeChannel } from '@/lib/youtube';

export async function HeroSectionWithData() {
  const [
    curseForgeStats,
    discordProfile,
    githubContributions,
    modrinthStats,
    youtubeChannel,
  ] = await Promise.all([
    fetchCurseForgeStats(config.curseForgeGameId, config.curseForgeAuthor),
    fetchDiscordProfile(config.discordUserId),
    fetchGitHubContributions(config.githubUsername),
    fetchModrinthStats(config.modrinthUsername),
    fetchYouTubeChannel(config.youtubeHandle),
  ]);

  return (
    <HeroSection
      curseForgeStats={curseForgeStats}
      discordProfile={discordProfile}
      githubContributions={githubContributions}
      githubUsername={config.githubUsername}
      modrinthStats={modrinthStats}
      youtubeChannel={youtubeChannel}
    />
  );
}
