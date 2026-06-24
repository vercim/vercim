import { SiTelegram, SiYoutube, SiDiscord, SiRoblox, SiX, SiGithub, SiModrinth } from 'react-icons/si';
import { HiEnvelope } from 'react-icons/hi2';
import type { IconType } from 'react-icons';

export interface SocialEntry {
  id: string;
  label: string;    // platform name shown on the chip
  handle: string;   // your username / contact info (shown as tooltip)
  href: string;     // full URL or mailto: link — this is what gets copied on click
  icon?: IconType;  // brand icon — falls back to a globe if omitted
}

// ─── Edit this list to update or add social links ────────────────────────────
//
//   • Change handle / href when you rename an account
//   • Add a new entry with or without an icon (icon is optional)
//   • Order here = order on the page
//
export const socialLinks: SocialEntry[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    handle: 'kntex',
    href: '',
    icon: SiTelegram,
  },
  {
    id: 'discord',
    label: 'Discord',
    handle: 'kino.tea',
    href: '',
    icon: SiDiscord,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '',
    href: 'https://youtube.com/@kinoteax2',
    icon: SiYoutube,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    handle: '',
    href: 'https://x.com/kinoteax',
    icon: SiX,
  },
  {
    id: 'roblox',
    label: 'Roblox',
    handle: '',
    href: 'https://www.roblox.com/users/2254875642',
    icon: SiRoblox,
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'contact@verc.im',
    href: '',
    icon: HiEnvelope,
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
];
