'use client';

import { contacts } from '@/data/social';

export function ContactButtons() {
  return (
    <ul className="contact-buttons">
      {contacts.map(({ id, label, account, href, icon: Icon }) => (
        <li key={id}>
          {href ? (
            <a className="contact-button" href={href} target="_blank" rel="noreferrer">
              <Icon aria-hidden="true" />
              {label}
            </a>
          ) : (
            <button
              type="button"
              className="contact-button"
              aria-label={`Copy ${label} username ${account}`}
              onClick={() => navigator.clipboard?.writeText(account).catch(() => {})}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
