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
    handle: '@YOUR_USERNAME',            // TODO: replace
    href: 'https://t.me/YOUR_USERNAME',  // TODO: replace
    icon: SiTelegram,
  },
  {
    id: 'discord',
    label: 'Discord',
    handle: 'YOUR_USERNAME',
    href: 'https://discord.com/users/YOUR_USER_ID', // TODO: replace with numeric ID
    icon: SiDiscord,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    handle: '@YOUR_CHANNEL',
    href: 'https://youtube.com/@YOUR_CHANNEL',      // TODO: replace
    icon: SiYoutube,
  },
  {
    id: 'twitter',
    label: 'X',
    handle: '@YOUR_USERNAME',
    href: 'https://x.com/YOUR_USERNAME',            // TODO: replace
    icon: SiX,
  },
  {
    id: 'roblox',
    label: 'Roblox',
    handle: 'YOUR_USERNAME',
    href: 'https://www.roblox.com/users/YOUR_USER_ID/profile', // TODO: replace with numeric ID
    icon: SiRoblox,
  },
  {
    id: 'email',
    label: 'Email',
    handle: 'skutovlev@gmail.com',
    href: 'mailto:skutovlev@gmail.com',
    icon: HiOutlineEnvelope,
  },
];
