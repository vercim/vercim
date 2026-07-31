'use client';

import { useEffect, useRef } from 'react';
import { socialLinks } from '@/data/social';
import type { CurseForgeStatsResult } from '@/lib/curseforge';
import type { DiscordProfileResult } from '@/lib/discord';
import type { GitHubContributions } from '@/lib/github';
import type { ModrinthStatsResult } from '@/lib/modrinth';
import type { YouTubeChannelResult } from '@/lib/youtube';
import { HoverBusinessCard } from '@/components/ui/hover-business-card';
import { SocialPreviewDock, type SocialPreviewItem } from '@/components/ui/social-preview-dock';

interface HeroSectionProps {
  curseForgeStats: CurseForgeStatsResult;
  discordProfile: DiscordProfileResult;
  githubContributions: GitHubContributions | null;
  githubUsername: string;
  modrinthStats: ModrinthStatsResult;
  youtubeChannel: YouTubeChannelResult;
}

export function HeroSection({
  curseForgeStats,
  discordProfile,
  githubContributions,
  githubUsername,
  modrinthStats,
  youtubeChannel,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const email = socialLinks.find((item) => item.id === 'email')?.handle;
  const items: SocialPreviewItem[] = socialLinks
    .filter((item) => item.id !== 'email')
    .map(({ id, label, href, icon: Icon }) => {
      const socialPreview = id === 'discord'
        ? discordProfile.status === 'success'
          ? {
              accent: discordProfile.profile.accentColor ?? '#5865f2',
              preview: {
                kind: 'discord' as const,
                status: 'success' as const,
                ...discordProfile.profile,
              },
            }
          : {
              accent: '#5865f2',
              preview: {
                kind: 'discord' as const,
                status: 'error' as const,
                message: discordProfile.message,
              },
            }
        : id === 'modrinth'
          ? modrinthStats.status === 'success'
            ? {
                accent: '#1bd96a',
                preview: {
                  kind: 'modrinth' as const,
                  status: 'success' as const,
                  downloads: modrinthStats.stats.totalDownloads,
                  series: modrinthStats.stats.projectDownloads,
                },
              }
            : {
                accent: '#1bd96a',
                preview: {
                  kind: 'modrinth' as const,
                  status: 'error' as const,
                  message: modrinthStats.message,
                },
              }
        : id === 'github'
        ? {
            accent: '#22c55e',
            preview: {
              kind: 'github' as const,
              username: githubUsername,
              contributions: githubContributions?.total ?? null,
              levels: githubContributions?.levels ?? [],
            },
          }
        : id === 'youtube'
          ? youtubeChannel.status === 'success'
            ? {
                accent: '#ff3b30',
                preview: {
                  kind: 'youtube' as const,
                  status: 'success' as const,
                  ...youtubeChannel.channel,
                },
              }
            : {
                accent: '#ff3b30',
                preview: {
                  kind: 'youtube' as const,
                  status: 'error' as const,
                  message: youtubeChannel.message,
                },
              }
        : curseForgeStats.status === 'success'
          ? {
              accent: '#f16436',
              preview: {
                kind: 'curseforge' as const,
                status: 'success' as const,
                downloads: curseForgeStats.stats.totalDownloads,
                series: curseForgeStats.stats.projectDownloads,
              },
            }
          : {
              accent: '#f16436',
              preview: {
                kind: 'curseforge' as const,
                status: 'error' as const,
                message: curseForgeStats.message,
              },
            };

      return {
        id,
        label,
        href: href || undefined,
        icon: Icon ? <Icon aria-hidden="true" /> : null,
        ...socialPreview,
      };
    });

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const mobile = window.matchMedia('(max-width: 520px)');
    const updateDeviceHeight = () => {
      if (!mobile.matches) {
        hero.style.removeProperty('--hero-device-height');
        hero.style.removeProperty('--hero-content-offset');
        hero.style.removeProperty('--hero-socials-offset');
        return;
      }

      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const deviceHeight = Math.max(window.screen.height, viewportHeight);
      const browserChromeHeight = Math.max(0, deviceHeight - viewportHeight);

      hero.style.setProperty('--hero-device-height', `${Math.round(deviceHeight)}px`);
      hero.style.setProperty('--hero-content-offset', `${Math.round(-browserChromeHeight / 2)}px`);
      hero.style.setProperty('--hero-socials-offset', `${Math.round(-browserChromeHeight)}px`);
    };

    updateDeviceHeight();
    mobile.addEventListener('change', updateDeviceHeight);
    window.addEventListener('resize', updateDeviceHeight);
    window.addEventListener('orientationchange', updateDeviceHeight);
    window.visualViewport?.addEventListener('resize', updateDeviceHeight);

    return () => {
      mobile.removeEventListener('change', updateDeviceHeight);
      window.removeEventListener('resize', updateDeviceHeight);
      window.removeEventListener('orientationchange', updateDeviceHeight);
      window.visualViewport?.removeEventListener('resize', updateDeviceHeight);
    };
  }, []);

  return (
    <section ref={heroRef} id="home" className="hero-section border-b border-divider">
      <a href="#home" className="hero-logo" aria-label="Vercim — back to the top">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 2H0V14H16V2ZM5 10.5C6.38071 10.5 7.5 9.38071 7.5 8C7.5 6.61929 6.38071 5.5 5 5.5C3.61929 5.5 2.5 6.61929 2.5 8C2.5 9.38071 3.61929 10.5 5 10.5ZM10 5H14V7H10V5ZM14 9H10V11H14V9Z"
            fill="currentColor"
          />
        </svg>
      </a>

      <div className="hero-section__content">
        <HoverBusinessCard />
      </div>

      <div className="hero-section__socials">
        <SocialPreviewDock items={items} email={email} />
      </div>
    </section>
  );
}
