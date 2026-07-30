'use client';

import { socialLinks } from '@/data/social';
import { HoverBusinessCard } from '@/components/ui/hover-business-card';
import { SocialPreviewDock, type SocialPreviewItem } from '@/components/ui/social-preview-dock';

const SOCIAL_PREVIEWS: Record<string, Omit<SocialPreviewItem, 'id' | 'label' | 'href' | 'icon'>> = {
  discord: {
    accent: '#5865f2',
    preview: {
      kind: 'discord',
      name: 'Vercim',
      handle: '@teathh',
      badges: ['Early supporter', 'Creator', 'Active developer'],
    },
  },
  youtube: {
    accent: '#ff3b30',
    preview: {
      kind: 'youtube',
      name: 'teatthh',
      handle: '@teatthh',
      subscribers: '12.4K',
      views: '2.8M',
    },
  },
  github: {
    accent: '#22c55e',
    preview: {
      kind: 'github',
      username: 'vercim',
      contributions: '2,227',
    },
  },
  modrinth: {
    accent: '#1bd96a',
    preview: {
      kind: 'downloads',
      platform: 'Modrinth',
      downloads: '284K',
      series: [18, 24, 22, 31, 29, 38, 46, 43, 58, 64, 61, 78],
    },
  },
  curseforge: {
    accent: '#f16436',
    preview: {
      kind: 'downloads',
      platform: 'CurseForge',
      downloads: '1.3M',
      series: [31, 28, 42, 48, 45, 61, 58, 72, 86, 81, 94, 108],
    },
  },
};

export function HeroSection() {
  const email = socialLinks.find((item) => item.id === 'email')?.handle;
  const items: SocialPreviewItem[] = socialLinks
    .filter((item) => item.id !== 'email')
    .map(({ id, label, href, icon: Icon }) => ({
      id,
      label,
      href: href || undefined,
      icon: Icon ? <Icon aria-hidden="true" /> : null,
      ...SOCIAL_PREVIEWS[id],
    }));

  return (
    <section id="home" className="hero-section border-b border-divider">
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
