import { SiDiscord, SiTelegram, SiX } from 'react-icons/si';
import type { IconType } from 'react-icons';

export type ContactId = 'telegram' | 'x' | 'discord';

export interface Contact {
  id: ContactId;
  label: string;     // Platform name used for accessible labels.
  account: string;   // Username without the leading @.
  href: string;      // Profile URL. Empty when the button copies the account instead.
  icon: IconType;
}

interface ContactDefinition extends Omit<Contact, 'href'> {
  profileUrl?: (account: string) => string;
}

// ─── Edit this list to update contacts ───────────────────────────────────────
//
//   • account is the only place a username lives; the link follows it
//   • An entry without profileUrl copies its account on click (Discord has
//     no public profile URL for a username)
//   • Order here = order on the page
//
const contactDefinitions: ContactDefinition[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    account: 'kntex',
    profileUrl: (account) => `https://t.me/${account}`,
    icon: SiTelegram,
  },
  {
    id: 'x',
    label: 'X',
    account: 'vercims',
    profileUrl: (account) => `https://x.com/${account}`,
    icon: SiX,
  },
  {
    id: 'discord',
    label: 'Discord',
    account: 'vercim',
    icon: SiDiscord,
  },
];

export const contacts: Contact[] = contactDefinitions.map(({ profileUrl, ...entry }) => ({
  ...entry,
  href: profileUrl ? profileUrl(entry.account) : '',
}));

// Accounts read by the download-count fetchers in src/lib.
export const modAccounts = {
  modrinth: 'vercim',
  curseforge: 'vercim',
} as const;
