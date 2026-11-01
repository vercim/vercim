export type ContactId = 'discord' | 'telegram' | 'x';

export interface Contact {
  id: ContactId;
  label: string;     // Platform name shown before the handle.
  account: string;   // Username without the leading @.
  handle: string;    // Account as shown on the page.
  href: string;      // Profile URL. Empty when the entry copies the account instead.
}

interface ContactDefinition extends Omit<Contact, 'handle' | 'href'> {
  showAt?: boolean;
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
    id: 'discord',
    label: 'discord',
    account: 'vercim',
  },
  {
    id: 'telegram',
    label: 'telegram',
    account: 'kntex',
    showAt: true,
    profileUrl: (account) => `https://t.me/${account}`,
  },
  {
    id: 'x',
    label: 'twitter',
    account: 'vercims',
    showAt: true,
    profileUrl: (account) => `https://x.com/${account}`,
  },
];

export const contacts: Contact[] = contactDefinitions.map(({ showAt, profileUrl, ...entry }) => ({
  ...entry,
  handle: showAt ? `@${entry.account}` : entry.account,
  href: profileUrl ? profileUrl(entry.account) : '',
}));

// Accounts read by the download-count fetchers in src/lib.
export const modAccounts = {
  modrinth: 'vercim',
  curseforge: 'vercim',
} as const;

export const githubAccount = 'vercim';
