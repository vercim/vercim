'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

export type SocialPreview =
  | {
      kind: 'discord';
      name: string;
      handle: string;
    }
  | {
      kind: 'youtube';
      name: string;
      handle: string;
      subscribers: string;
      views: string;
    }
  | {
      kind: 'github';
      username: string;
      contributions: string;
    }
  | {
      kind: 'downloads';
      platform: 'Modrinth' | 'CurseForge';
      downloads: string;
      series: number[];
    };

export interface SocialPreviewItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  accent: string;
  preview: SocialPreview;
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
const CONTRIBUTION_LEVELS = Array.from({ length: 364 }, (_, index) => {
  const column = Math.floor(index / 7);
  const value = (index * 17 + column * 13 + Math.floor(column / 5) * 7) % 29;

  if (value < 10) return 0;
  if (value < 17) return 1;
  if (value < 23) return 2;
  if (value < 27) return 3;
  return 4;
});

function offsetLeftWithin(element: HTMLElement, ancestor: HTMLElement) {
  let offset = 0;
  let node: HTMLElement | null = element;

  while (node && node !== ancestor) {
    offset += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }

  return offset;
}

function ProfileCard({
  icon,
  name,
  handle,
  details,
  detailsPosition = 'below',
  action,
}: {
  icon: React.ReactNode;
  name: string;
  handle: string;
  details?: React.ReactNode;
  detailsPosition?: 'below' | 'aside';
  action: React.ReactNode;
}) {
  return (
    <>
      <div className="social-preview-card__banner">
        {action}
      </div>
      <div className="social-preview-card__profile-body">
        <div className="social-preview-card__avatar" aria-hidden="true">
          {icon}
        </div>
        <div className="social-preview-card__profile-content">
          <div className="social-preview-card__identity">
            <p className="social-preview-card__name">{name}</p>
            <p className="social-preview-card__handle">{handle}</p>
            {details && detailsPosition === 'below' ? (
              <div className="social-preview-card__details">{details}</div>
            ) : null}
          </div>
          {details && detailsPosition === 'aside' ? (
            <div className="social-preview-card__details social-preview-card__details--aside">
              {details}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function PreviewAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      className="social-preview-card__action"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

function DownloadChart({
  platform,
  downloads,
  series,
  action,
}: {
  platform: string;
  downloads: string;
  series: number[];
  action: React.ReactNode;
}) {
  const width = 288;
  const height = 56;
  const max = Math.max(...series, 1);
  const points = series.map((value, index) => {
    const x = (index / Math.max(series.length - 1, 1)) * width;
    const y = height - (value / max) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <>
      <div className="social-preview-card__download-heading">
        <div>
          <p className="social-preview-card__name">{platform}</p>
          <p className="social-preview-card__download-total">{downloads} downloads</p>
        </div>
        {action}
      </div>
      <svg
        className="social-preview-card__download-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${platform} download activity`}
        preserveAspectRatio="none"
      >
        <path className="social-preview-card__chart-grid" d={`M 0 ${height / 2} H ${width}`} />
        <path className="social-preview-card__chart-area" d={area} />
        <path className="social-preview-card__chart-line" d={line} />
      </svg>
    </>
  );
}

function PreviewCard({ item }: { item: SocialPreviewItem }) {
  const { preview } = item;
  const fallbackHref = preview.kind === 'discord' ? 'https://discord.com/app' : '#';
  const actionHref = item.href || fallbackHref;

  return (
    <div
      className={`social-preview-card social-preview-card--${preview.kind}`}
      style={{ '--social-accent': item.accent } as React.CSSProperties}
    >
      {preview.kind === 'discord' ? (
        <ProfileCard
          icon={item.icon}
          name={preview.name}
          handle={preview.handle}
          action={<PreviewAction href={actionHref} label="Open" />}
        />
      ) : null}

      {preview.kind === 'youtube' ? (
        <ProfileCard
          icon={item.icon}
          name={preview.name}
          handle={preview.handle}
          detailsPosition="aside"
          action={<PreviewAction href={actionHref} label="Subscribe" />}
          details={
            <>
              <span>{preview.subscribers} subscribers</span>
              <span>{preview.views} views</span>
            </>
          }
        />
      ) : null}

      {preview.kind === 'github' ? (
        <>
          <div className="social-preview-card__github-heading">
            <div>
              <p className="social-preview-card__name">{preview.username}</p>
              <p className="social-preview-card__github-caption">
                {preview.contributions} contributions in the last year
              </p>
            </div>
            <PreviewAction href={actionHref} label="View profile" />
          </div>
          <div
            className="social-preview-card__heatmap"
            role="img"
            aria-label={`${preview.contributions} GitHub contributions in the last year`}
          >
            {CONTRIBUTION_LEVELS.map((level, index) => (
              <span key={index} data-level={level} aria-hidden="true" />
            ))}
          </div>
        </>
      ) : null}

      {preview.kind === 'downloads' ? (
        <DownloadChart
          platform={preview.platform}
          downloads={preview.downloads}
          series={preview.series}
          action={<PreviewAction href={actionHref} label="View projects" />}
        />
      ) : null}
    </div>
  );
}

function CopyEmailButton({ email, onActivate }: { email: string; onActivate: () => void }) {
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
      timerRef.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      window.location.assign(`mailto:${email}`);
    }
  };

  return (
    <button
      type="button"
      className="social-preview-dock__email"
      data-copied={copied ? '' : undefined}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={copyEmail}
    >
      <span className="social-preview-dock__email-label">Copy email</span>
      <span className="social-preview-dock__email-label social-preview-dock__email-label--copied" aria-hidden="true">
        Copied!
      </span>
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
    const activeItem = activeIndex === null ? null : items[activeIndex];
    const card = activeItem
      ? panelRef.current?.querySelector<HTMLElement>(`[data-preview-card="${activeItem.id}"]`)
      : null;

    if (!wrapper || !trigger || !card) return;

    const measure = () => {
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      const wrapperLeft = wrapper.getBoundingClientRect().left;
      const centered = offsetLeftWithin(trigger, wrapper) + trigger.offsetWidth / 2 - width / 2;
      const x = Math.max(
        PANEL_MARGIN - wrapperLeft,
        Math.min(centered, window.innerWidth - PANEL_MARGIN - width - wrapperLeft),
      );

      setBox({ x, width, height });
    };

    measure();
    openedRef.current = true;

    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [activeIndex, items]);

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
          <AnimatePresence initial={false}>
            {activeItem && (
              <motion.div
                key={activeItem.id}
                data-preview-card={activeItem.id}
                className="social-preview-dock__card-position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
        {email ? <CopyEmailButton email={email} onActivate={close} /> : null}
      </nav>
    </div>
  );
}
