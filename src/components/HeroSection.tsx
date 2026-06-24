'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { Globe, Check, ArrowUpRight } from 'lucide-react';
import { TextMorph } from 'torph/react';
import { socialLinks } from '@/data/social';
import { config } from '@/data/config';
import { useGifEnabled } from '@/hooks/useGifEnabled';
import { useMotionEnabled } from '@/hooks/useMotionEnabled';

export function HeroSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string>('');
  const { enabled } = useGifEnabled();
  const { enabled: motionEnabled } = useMotionEnabled();

  useEffect(() => {
    const { gifUrls } = config;
    if (!gifUrls.length) return;

    if (!enabled) {
      setGifUrl(gifUrls[0]);
      return;
    }

    const KEY = 'hero_next_gif';
    const stored = sessionStorage.getItem(KEY);
    const current = stored && gifUrls.includes(stored) ? stored : gifUrls[0];
    setGifUrl(current);

    const pool = gifUrls.filter((u) => u !== current);
    const next = (pool.length ? pool : gifUrls)[Math.floor(Math.random() * (pool.length || gifUrls.length))];
    sessionStorage.setItem(KEY, next);

    const img = new Image();
    img.src = next;
  }, [enabled]);

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
    <section id="home" className="min-h-screen flex items-center justify-center border-b border-divider px-4 py-8">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative w-[250px] h-[250px] overflow-hidden shrink-0 max-[480px]:w-40 max-[480px]:h-40">
          {gifUrl && (
            <NextImage
              src={gifUrl}
              alt="Just a fun gif"
              fill
              unoptimized
              priority
              className="object-cover object-center animate-fade-in"
              draggable={false}
            />
          )}
        </div>

        <p className="text-[0.8125rem] text-subtle tracking-[0.05em]">vercim / kino / kinotea</p>
        <p className="text-[0.8125rem] text-subtle tracking-[0.05em]">my socials here 👇</p>

        <nav className="grid grid-cols-2 gap-[0.45rem] w-full max-w-[380px] sm:flex sm:flex-wrap sm:justify-center" aria-label="Social links">
          {socialLinks.map(({ id, icon: Icon, label, handle, href }, index) => {
            const isCopied = copied === id;
            const isLink = !!href;
            const delay = `${index * 60}ms`;
            const animStyle = motionEnabled
              ? { opacity: 0, animation: `slide-up-fade 0.45s ease ${delay} both` }
              : {};
            const chipClass = `inline-flex items-center justify-center gap-2 px-4 py-[0.625rem] min-h-[44px] border border-line-soft bg-transparent text-muted text-[0.8rem] font-bold tracking-[0.04em] no-underline cursor-pointer transition-colors select-none [-webkit-tap-highlight-color:transparent] hover:text-fg hover:border-line-hover overflow-hidden`;

            if (isLink) {
              return (
                <a key={id} href={href} target="_blank" rel="noopener noreferrer"
                  className={chipClass} style={animStyle} title={`Open ${label}`} aria-label={`Open ${label}`}>
                  {Icon ? <Icon size={16} /> : <Globe size={16} />}
                  <span>{label}</span>
                </a>
              );
            }

            return (
              <button key={id} type="button"
                onClick={() => copyToClipboard(id, handle)}
                className={`${chipClass}${isCopied ? ' !text-fg !border-line-bright' : ''}`}
                style={animStyle}
                title={`Copy ${handle}`} aria-label={`Copy ${label} — ${handle}`}>
                {isCopied ? <Check size={16} className="animate-[check-pop_0.3s_ease_both]" /> : Icon ? <Icon size={16} /> : <Globe size={16} />}
                <TextMorph disabled={!motionEnabled}>{isCopied ? 'copied' : label}</TextMorph>
              </button>
            );
          })}
        </nav>

        {config.marketplaceUrl && (
          <a
            href={config.marketplaceUrl}
            className="group inline-flex items-center gap-[0.4rem] bg-none border-none px-0 py-2 min-h-[44px] text-subtle text-[0.8rem] tracking-[0.06em] uppercase no-underline cursor-pointer transition-colors hover:text-fg [-webkit-tap-highlight-color:transparent]"
            target="_blank" rel="noopener noreferrer"
          >
            <span className="relative after:absolute after:left-0 after:bottom-[-1px] after:w-full after:h-px after:bg-current after:scale-x-0 after:origin-left after:transition-transform group-hover:after:scale-x-100">
              My own store
            </span>
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
