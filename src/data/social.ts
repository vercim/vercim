import { SiYoutube, SiDiscord, SiGithub, SiModrinth, SiCurseforge } from 'react-icons/si';
import { HiEnvelope } from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export interface SocialEntry {
  id: string;
  label: string;    // Platform name used for accessible labels.
  handle: string;   // Username or contact value used by non-link actions.
  href: string;     // External profile URL. Leave empty for preview-only items.
  icon?: IconType;  // Brand icon shown in the social dock.
}

// ─── Edit this list to update or add social links ────────────────────────────
//
//   • Change handle / href when you rename an account
//   • Add a new entry with or without an icon (icon is optional)
//   • Order here = order on the page
//
export const socialLinks: SocialEntry[] = [
  {
    id: 'discord',
    label: 'Discord',
    handle: 'teathh',
    href: '',
    icon: SiDiscord,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '',
    href: 'https://youtube.com/@teatthh',
    icon: SiYoutube,
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: '',
    href: 'https://github.com/vercim',
    icon: SiGithub,
  },
  {
    id: 'modrinth',
    label: 'Modrinth',
    handle: '',
    href: 'https://modrinth.com/user/vercim',
    icon: SiModrinth,
  },
    {
    id: 'curseforge',
    label: 'CurseForge',
    handle: '',
    href: 'https://www.curseforge.com/members/vercim/projects',
    icon: SiCurseforge,
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'contact@verc.im',
    href: '',
    icon: HiEnvelope,
  },
];
