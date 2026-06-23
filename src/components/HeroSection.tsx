'use client';

import { useState } from 'react';
import { Globe, Check, ArrowUpRight } from 'lucide-react';
import { socialLinks } from '@/data/social';
import { config } from '@/data/config';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.gifBlock}>
          {config.gifUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={config.gifUrl} alt="" className={styles.gif} draggable={false} />
          ) : (
            <div className={styles.gifPlaceholder}>gif</div>
          )}
        </div>

        <p className={styles.role}>my socials here 👇</p>

        <nav className={styles.links} aria-label="Social links">
          {socialLinks.map(({ id, icon: Icon, label, handle, href }) => {
            const isCopied = copied === id;
            const isLink = !!href;

            if (isLink) {
              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.chip}
                  title={`Open ${label}`}
                  aria-label={`Open ${label}`}
                >
                  {Icon ? <Icon size={14} /> : <Globe size={14} />}
                  <span>{label}</span>
                </a>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => copyToClipboard(id, handle)}
                className={`${styles.chip}${isCopied ? ` ${styles.chipCopied}` : ''}`}
                title={`Copy ${handle}`}
                aria-label={`Copy ${label} — ${handle}`}
              >
                {isCopied
                  ? <Check size={14} />
                  : Icon
                    ? <Icon size={14} />
                    : <Globe size={14} />}
                <span>{isCopied ? 'copied' : label}</span>
              </button>
            );
          })}
        </nav>

        {config.marketplaceUrl && (
          <a
            href={config.marketplaceUrl}
            className={styles.marketplace}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>My marketplace</span>
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </section>
  );
}
