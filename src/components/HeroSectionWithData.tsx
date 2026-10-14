import { HeroSection } from '@/components/HeroSection';
import { getSocialAccount } from '@/data/social';
import { fetchCurseForgeStats } from '@/lib/curseforge';
import { fetchDiscordProfile } from '@/lib/discord';
import { fetchGitHubContributions } from '@/lib/github';
import { fetchModrinthStats } from '@/lib/modrinth';
import { fetchYouTubeChannel } from '@/lib/youtube';

export async function HeroSectionWithData() {
  const githubUsername = getSocialAccount('github');
  const [
    curseForgeStats,
    discordProfile,
    githubContributions,
    modrinthStats,
    youtubeChannel,
  ] = await Promise.all([
    fetchCurseForgeStats(getSocialAccount('curseforge')),
    fetchDiscordProfile(getSocialAccount('discord')),
    fetchGitHubContributions(githubUsername),
    fetchModrinthStats(getSocialAccount('modrinth')),
    fetchYouTubeChannel(getSocialAccount('youtube')),
  ]);

  return (
    <HeroSection
      curseForgeStats={curseForgeStats}
      discordProfile={discordProfile}
      githubContributions={githubContributions}
      githubUsername={githubUsername}
      modrinthStats={modrinthStats}
      youtubeChannel={youtubeChannel}
    />
  );
}
