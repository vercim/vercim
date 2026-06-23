import { SiTelegram, SiYoutube, SiDiscord, SiRoblox, SiX } from 'react-icons/si';
import { HiOutlineEnvelope } from 'react-icons/hi2';
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
    href: 'https://youtube.com/@knoteax',
    icon: SiYoutube,
  },
  {
    id: 'twitter',
    label: 'Twitter',
    handle: '',
    href: 'https://x.com/kinoteatre',
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
    handle: 'skutovlev@gmail.com',
    href: '',
    icon: HiOutlineEnvelope,
  },
];
