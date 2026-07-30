'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

export interface SocialPreviewItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  width?: number;
}

interface SocialPreviewDockProps {
  items: SocialPreviewItem[];
  email?: string;
  className?: string;
}

const PANEL_MARGIN = 12;
const FADE = { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const };
const MOVE = { type: 'spring' as const, stiffness: 620, damping: 46, mass: 0.8 };
const RESIZE = { type: 'spring' as const, stiffness: 700, damping: 54, mass: 0.8 };
const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function offsetLeftWithin(element: HTMLElement, ancestor: HTMLElement) {
  let offset = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    offset += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }

  return offset;
}

function PreviewCard({ item }: { item: SocialPreviewItem }) {
  return (
    <div
      className="social-preview-card"
      style={{ '--social-accent': item.accent, width: item.width ?? 300 } as React.CSSProperties}
    >
      <div className="social-preview-card__accent" aria-hidden="true" />
      <div className="social-preview-card__content">
        <p className="social-preview-card__eyebrow">{item.eyebrow}</p>
        <p className="social-preview-card__title">{item.title}</p>
        <p className="social-preview-card__description">{item.description}</p>
      </div>
    </div>
  );
}

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.assign(`mailto:${email}`);
    }
  };

  return (
    <button type="button" className="social-preview-dock__email" onClick={copyEmail}>
      {copied ? 'Copied' : 'Copy email'}
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${email} copied to clipboard` : ''}
      </span>
    </button>
  );
}

export function SocialPreviewDock({ items, email, className = '' }: SocialPreviewDockProps) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<(HTMLElement | null)[]>([]);
  const openedRef = React.useRef(false);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [box, setBox] = React.useState({ x: 0, width: 0, height: 0 });

  useIsoLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const trigger = activeIndex === null ? null : triggerRefs.current[activeIndex];
    const card = panelRef.current?.querySelector<HTMLElement>('[data-preview-card]');

    if (!wrapper || !trigger || !card) return;

    const width = card.offsetWidth;
    const height = card.offsetHeight;
    const wrapperLeft = wrapper.getBoundingClientRect().left;
    const centered = offsetLeftWithin(trigger, wrapper) + trigger.offsetWidth / 2 - width / 2;
    const x = Math.max(
      PANEL_MARGIN - wrapperLeft,
      Math.min(centered, window.innerWidth - PANEL_MARGIN - width - wrapperLeft),
    );

    setBox({ x, width, height });
    openedRef.current = true;
  }, [activeIndex]);

  const close = React.useCallback(() => {
    openedRef.current = false;
    setActiveIndex(null);
  }, []);

  const activeItem = activeIndex === null ? null : items[activeIndex];
  const visible = activeItem !== null && box.width > 0;
  const firstAppearance = !openedRef.current;

  return (
    <div
      ref={wrapperRef}
      className={`social-preview-dock ${className}`}
      onMouseLeave={close}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
    >
      <div
        className="social-preview-dock__panel-wrap"
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <motion.div
          ref={panelRef}
          className="social-preview-dock__panel"
          initial={false}
          animate={{
            x: box.x,
            width: box.width,
            height: box.height,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            opacity: FADE,
            x: firstAppearance ? { duration: 0 } : MOVE,
            width: firstAppearance ? { duration: 0 } : RESIZE,
            height: firstAppearance ? { duration: 0 } : RESIZE,
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {activeItem && (
              <motion.div
                key={activeItem.id}
                data-preview-card
                className="social-preview-dock__card-position"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={FADE}
              >
                <PreviewCard item={activeItem} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <nav className="social-preview-dock__rail" aria-label="Social links">
        {items.map((item, index) => {
          const sharedProps = {
            'aria-label': item.label,
            'aria-expanded': activeIndex === index,
            onMouseEnter: () => setActiveIndex(index),
            onFocus: () => setActiveIndex(index),
            onClick: () => {
              if (!item.href) setActiveIndex(index);
            },
            className: 'social-preview-dock__trigger',
            'data-active': activeIndex === index ? '' : undefined,
          };

          if (item.href) {
            return (
              <a
                {...sharedProps}
                key={item.id}
                ref={(element) => {
                  triggerRefs.current[index] = element;
                }}
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {item.icon}
              </a>
            );
          }

          return (
            <button
              {...sharedProps}
              key={item.id}
              ref={(element) => {
                triggerRefs.current[index] = element;
              }}
              type="button"
            >
              {item.icon}
            </button>
          );
        })}
        {email ? <CopyEmailButton email={email} /> : null}
      </nav>
    </div>
  );
}
