'use client';

import type { contacts } from '@/data/social';

export function ContactList({ usernames }: { usernames: typeof contacts }) {
  return (
    <ul className="display-type flex flex-col items-start" role="list">
      {Object.entries(usernames).map(([platform, { username, link }]) => {
        const label = `${platform}: ${link ? '@' : ''}${username}`;

        return (
          <li key={platform} className="reveal">
            {link ? (
              <a
                className="contact-link reveal__line"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                {label}
              </a>
            ) : (
              <button
                type="button"
                className="contact-link reveal__line"
                aria-label={`${label} (copy username)`}
                onClick={() => navigator.clipboard?.writeText(username).catch(() => {})}
              >
                {label}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
