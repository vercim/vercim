interface Contact {
  username: string;
  link?: string;
}

const telegramUsername = 'kntex';
const twitterUsername = 'vercims';

export const contacts: Record<string, Contact> = {
  discord: { username: 'vercim' },
  telegram: {
    username: telegramUsername,
    link: `https://t.me/${telegramUsername}`,
  },
  twitter: {
    username: twitterUsername,
    link: `https://x.com/${twitterUsername}`,
  },
};

// Accounts read by the download-count fetchers in src/lib.
export const modAccounts = {
  modrinth: 'vercim',
  curseforge: 'vercim',
} as const;
