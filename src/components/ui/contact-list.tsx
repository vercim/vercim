'use client';

import type { Contact } from '@/data/social';

export function ContactList({ contacts }: { contacts: Contact[] }) {
  return (
    <ul className="contact-list">
      {contacts.map(({ id, label, account, handle, href }) => (
        <li key={id}>
          {href ? (
            <a className="contact-list__item" href={href} target="_blank" rel="noreferrer">
              {label}: {handle}
            </a>
          ) : (
            <button
              type="button"
              className="contact-list__item"
              aria-label={`${label}: ${handle} (copy username)`}
              onClick={() => navigator.clipboard?.writeText(account).catch(() => {})}
            >
              {label}: {handle}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
