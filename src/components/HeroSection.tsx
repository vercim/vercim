'use client';

import { socialLinks } from '@/data/social';
import { HoverBusinessCard } from '@/components/ui/hover-business-card';
import { SocialPreviewDock, type SocialPreviewItem } from '@/components/ui/social-preview-dock';

const SOCIAL_PREVIEWS: Record<string, Omit<SocialPreviewItem, 'id' | 'label' | 'href' | 'icon'>> = {
  discord: {
    eyebrow: 'Community preview',
    title: 'Discord space',
    description: 'Placeholder for a community status, invite details and current activity.',
    accent: '#5865f2',
    width: 310,
  },
  youtube: {
    eyebrow: 'Channel preview',
    title: 'YouTube channel',
    description: 'Placeholder for recent uploads, channel notes and featured video information.',
    accent: '#ff3b30',
    width: 326,
  },
  github: {
    eyebrow: 'Developer preview',
    title: 'GitHub profile',
    description: 'Placeholder for contribution activity, highlighted repositories and current work.',
    accent: '#8b5cf6',
    width: 340,
  },
  modrinth: {
    eyebrow: 'Creator preview',
    title: 'Modrinth profile',
    description: 'Placeholder for published mods, download totals and the latest project update.',
    accent: '#1bd96a',
    width: 318,
  },
  curseforge: {
    eyebrow: 'Creator preview',
    title: 'CurseForge profile',
    description: 'Placeholder for project releases, supported versions and community activity.',
    accent: '#f16436',
    width: 334,
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
