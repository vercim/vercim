'use client';

import type { CSSProperties } from 'react';
import type { Contact } from '@/data/social';

export function ContactList({ contacts }: { contacts: Contact[] }) {
  return (
    <ul className="contact-list">
      {contacts.map(({ id, label, account, handle, href }, index) => (
        <li
          key={id}
          className="hero-reveal"
          style={{ '--reveal-delay': `${index * 0.1}s` } as CSSProperties}
        >
          {href ? (
            <a className="contact-list__item hero-reveal__line" href={href} target="_blank" rel="noreferrer">
              {label}: {handle}
            </a>
          ) : (
            <button
              type="button"
              className="contact-list__item hero-reveal__line"
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
