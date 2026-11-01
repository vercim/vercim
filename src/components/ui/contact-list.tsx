'use client';

import type { CSSProperties } from 'react';
import type { Contact } from '@/data/social';

export function ContactList({ contacts }: { contacts: Contact[] }) {
  return (
    <ul className="m-0 list-none p-0 text-[clamp(1.75rem,4.8vw,4.75rem)] leading-[1.05] tracking-[-0.045em]">
      {contacts.map(({ id, label, account, handle, href }, index) => (
        <li
          key={id}
          className="reveal"
          style={{ '--reveal-delay': `${index * 0.1}s` } as CSSProperties}
        >
          {href ? (
            <a
              className="reveal__line cursor-pointer border-0 border-none bg-transparent p-0 text-on-sky no-underline transition-colors duration-150 ease-contact [font:inherit] tracking-inherit focus-visible:text-on-sky-dim focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-[0.12em] focus-visible:outline-none"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {label}: {handle}
            </a>
          ) : (
            <button
              type="button"
              className="reveal__line cursor-pointer border-0 border-none bg-transparent p-0 text-on-sky no-underline transition-colors duration-150 ease-contact [font:inherit] tracking-inherit focus-visible:text-on-sky-dim focus-visible:underline focus-visible:decoration-2 focus-visible:underline-offset-[0.12em] focus-visible:outline-none"
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
