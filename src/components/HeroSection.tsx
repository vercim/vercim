'use client';

import { useState } from 'react';
import { HiOutlineGlobeAlt, HiCheck, HiArrowUpRight } from 'react-icons/hi2';
import { socialLinks } from '@/data/social';
import { config } from '@/data/config';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (id: string, href: string) => {
    const text = href.startsWith('mailto:') ? href.replace('mailto:', '') : href;
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
            <img src={config.gifUrl} alt="" className={styles.gif} />
          ) : (
            <div className={styles.gifPlaceholder}>gif</div>
          )}
        </div>

        <p className={styles.role}>developer</p>

        <nav className={styles.links} aria-label="Social links">
          {socialLinks.map(({ id, icon: Icon, label, href }) => {
            const isCopied = copied === id;
            const DisplayIcon = Icon ?? HiOutlineGlobeAlt;
            return (
              <a
                key={id}
                href={href}
                onClick={(e) => { e.preventDefault(); handleCopy(id, href); }}
                className={`${styles.chip}${isCopied ? ` ${styles.chipCopied}` : ''}`}
                title={`Copy ${label} link`}
                aria-label={`Copy ${label} link`}
              >
                {isCopied ? <HiCheck size={12} /> : <DisplayIcon size={12} />}
                <span>{isCopied ? 'copied' : label}</span>
              </a>
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
            <span>Marketplace</span>
            <HiArrowUpRight size={14} />
          </a>
        )}
      </div>
    </section>
  );
}
