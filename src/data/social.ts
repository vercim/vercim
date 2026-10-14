import { SiYoutube, SiDiscord, SiGithub, SiModrinth, SiCurseforge } from 'react-icons/si';
import { HiEnvelope } from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export type SocialId = 'discord' | 'youtube' | 'github' | 'modrinth' | 'curseforge' | 'email';

export interface SocialEntry {
  id: SocialId;
  label: string;     // Platform name used for accessible labels.
  account?: string;  // Account identifier for API lookups: username, @handle or user ID.
  handle: string;    // Value used by non-link actions (Discord tag, email address).
  href: string;      // Profile URL built from the account. Empty for preview-only items.
  icon?: IconType;   // Brand icon shown in the social dock.
}

interface SocialDefinition extends Omit<SocialEntry, 'href'> {
  profileUrl?: (account: string) => string;
}

// ─── Edit this list to update or add social links ────────────────────────────
//
//   • Change account when you rename an account: the profile link and the
//     API lookups both follow it, so it is the only place to edit
//   • Add a new entry with or without an icon (icon is optional)
//   • Order here = order on the page
//
const socialDefinitions: SocialDefinition[] = [
  {
    id: 'discord',
    label: 'Discord',
    account: '493047421199450113',
    handle: 'tea.gg',
    icon: SiDiscord,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    account: '@vercim',
    handle: '',
    profileUrl: (account) => `https://youtube.com/${account}`,
    icon: SiYoutube,
  },
  {
    id: 'github',
    label: 'GitHub',
    account: 'vercim',
    handle: '',
    profileUrl: (account) => `https://github.com/${account}`,
    icon: SiGithub,
  },
  {
    id: 'modrinth',
    label: 'Modrinth',
    account: 'vercim',
    handle: '',
    profileUrl: (account) => `https://modrinth.com/user/${account}`,
    icon: SiModrinth,
  },
  {
    id: 'curseforge',
    label: 'CurseForge',
    account: 'vercim',
    handle: '',
    profileUrl: (account) => `https://www.curseforge.com/members/${account}/projects`,
    icon: SiCurseforge,
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'fake@fake.com',
    icon: HiEnvelope,
  },
];

export const socialLinks: SocialEntry[] = socialDefinitions.map(({ profileUrl, ...entry }) => ({
  ...entry,
  href: entry.account && profileUrl ? profileUrl(entry.account) : '',
}));

export function getSocialAccount(id: SocialId): string {
  return socialLinks.find((entry) => entry.id === id)?.account ?? '';
}
