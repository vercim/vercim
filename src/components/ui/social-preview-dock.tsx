'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import * as React from 'react';

export type SocialPreview =
  | {
      kind: 'discord';
      status: 'success';
      name: string;
      handle: string;
      avatarUrl: string;
      bannerUrl: string | null;
      accentColor: string | null;
      profileUrl: string;
    }
  | {
      kind: 'discord';
      status: 'error';
      message: string;
    }
  | {
      kind: 'youtube';
      status: 'success';
      name: string;
      handle: string;
      subscribers: number | null;
      views: number;
      avatarUrl: string;
      bannerUrl: string;
    }
  | {
      kind: 'youtube';
      status: 'error';
      message: string;
    }
  | {
      kind: 'github';
      username: string;
      contributions: number | null;
      levels: number[];
    }
  | {
      kind: 'modrinth';
      status: 'success';
      downloads: number;
      series: number[];
    }
  | {
      kind: 'modrinth';
      status: 'error';
      message: string;
    }
  | {
      kind: 'curseforge';
      status: 'success';
      downloads: number;
      series: number[];
    }
  | {
      kind: 'curseforge';
      status: 'error';
      message: string;
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
  avatarUrl,
  bannerUrl,
}: {
  icon: React.ReactNode;
  name: string;
  handle: string;
  details?: React.ReactNode;
  detailsPosition?: 'below' | 'aside';
  action: React.ReactNode;
  avatarUrl?: string;
  bannerUrl?: string;
}) {
  return (
    <>
      <div className="social-preview-card__banner">
        {bannerUrl ? (
          <Image
            className="social-preview-card__banner-image"
            src={bannerUrl}
            alt=""
            fill
            sizes="(max-width: 420px) calc(100vw - 1.5rem), 16rem"
          />
        ) : null}
        {action}
      </div>
      <div className="social-preview-card__profile-body">
        <div className="social-preview-card__avatar" aria-hidden="true">
          {avatarUrl ? (
            <Image
              className="social-preview-card__avatar-image"
              src={avatarUrl}
              alt=""
              fill
              sizes="52px"
            />
          ) : icon}
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

function formatCompactCount(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
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

function CopyAction({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error('[discord] clipboard write failed:', error);
    }
  };

  return (
    <button
      type="button"
      className="social-preview-card__action"
      data-copied={copied ? '' : undefined}
      onClick={handleCopy}
    >
      <span className="social-preview-card__action-label">Copy</span>
      <span
        className="social-preview-card__action-label social-preview-card__action-label--copied"
        aria-hidden="true"
      >
        Copied!
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${value} copied to clipboard` : ''}
      </span>
    </button>
  );
}

function DownloadChart({
  platform,
  downloads,
  action,
  ariaLabel = `${platform} download activity`,
}: {
  platform: string;
  downloads: string | number;
  action: React.ReactNode;
  ariaLabel?: string;
}) {
  const width = 288;
  const height = 56;
  const line = [
    `M 0 ${height * 0.58}`,
    `C ${width * 0.14} ${height * 0.16}, ${width * 0.28} ${height * 0.16}, ${width * 0.42} ${height * 0.5}`,
    `S ${width * 0.7} ${height * 0.86}, ${width} ${height * 0.32}`,
  ].join(' ');
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;

  return (
    <>
      <div className="social-preview-card__download-heading">
        <div>
          <p className="social-preview-card__name">{platform}</p>
          <p className="social-preview-card__download-total">
            {typeof downloads === 'number' ? formatCompactCount(downloads) : downloads} downloads
          </p>
        </div>
        {action}
      </div>
      <svg
        className="social-preview-card__download-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
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
  const actionHref = preview.kind === 'discord' && preview.status === 'success'
    ? preview.profileUrl
    : item.href || '#';

  return (
    <div
      className={`social-preview-card social-preview-card--${preview.kind}`}
      style={{ '--social-accent': item.accent } as React.CSSProperties}
    >
      {preview.kind === 'discord' && preview.status === 'success' ? (
        <ProfileCard
          icon={item.icon}
          name={preview.name}
          handle={preview.handle}
          avatarUrl={preview.avatarUrl}
          bannerUrl={preview.bannerUrl ?? undefined}
          action={<CopyAction value={preview.handle.replace(/^@/, '')} />}
        />
      ) : null}

      {preview.kind === 'discord' && preview.status === 'error' ? (
        <div className="social-preview-card__error" role="alert">
          <div>
            <p className="social-preview-card__name">Discord data unavailable</p>
            <p className="social-preview-card__error-message">{preview.message}</p>
          </div>
          <PreviewAction href="https://discord.com/app" label="Open Discord" />
        </div>
      ) : null}

      {preview.kind === 'youtube' && preview.status === 'success' ? (
        <ProfileCard
          icon={item.icon}
          name={preview.name}
          handle={preview.handle}
          avatarUrl={preview.avatarUrl}
          bannerUrl={preview.bannerUrl}
          detailsPosition="aside"
          action={<PreviewAction href={actionHref} label="Subscribe" />}
          details={
            <>
              <span>
                {preview.subscribers === null
                  ? 'Subscribers hidden'
                  : `${formatCompactCount(preview.subscribers)} subscribers`}
              </span>
              <span>{formatCompactCount(preview.views)} views</span>
            </>
          }
        />
      ) : null}

      {preview.kind === 'youtube' && preview.status === 'error' ? (
        <div className="social-preview-card__error" role="alert">
          <div>
            <p className="social-preview-card__name">YouTube data unavailable</p>
            <p className="social-preview-card__error-message">{preview.message}</p>
          </div>
          <PreviewAction href={actionHref} label="Open channel" />
        </div>
      ) : null}

      {preview.kind === 'github' ? (
        <>
          <div className="social-preview-card__github-heading">
            <div>
              <p className="social-preview-card__name">{preview.username}</p>
              <p className="social-preview-card__github-caption">
                {preview.contributions === null
                  ? 'Contributions unavailable'
                  : `${preview.contributions.toLocaleString('en-US')} contributions in the last year`}
              </p>
            </div>
            <PreviewAction href={actionHref} label="View profile" />
          </div>
          <div
            className="social-preview-card__heatmap"
            role="img"
            aria-label={preview.contributions === null
              ? 'GitHub contribution activity unavailable'
              : `${preview.contributions.toLocaleString('en-US')} GitHub contributions in the last year`}
          >
            {preview.levels.map((level, index) => (
              <span key={index} data-level={level} aria-hidden="true" />
            ))}
          </div>
        </>
      ) : null}

      {preview.kind === 'modrinth' && preview.status === 'success' ? (
        <DownloadChart
          platform="Modrinth"
          downloads={preview.downloads}
          ariaLabel="Modrinth downloads"
          action={<PreviewAction href={actionHref} label="View projects" />}
        />
      ) : null}

      {preview.kind === 'modrinth' && preview.status === 'error' ? (
        <div className="social-preview-card__error" role="alert">
          <div>
            <p className="social-preview-card__name">Modrinth data unavailable</p>
            <p className="social-preview-card__error-message">{preview.message}</p>
          </div>
          <PreviewAction href={actionHref} label="Open profile" />
        </div>
      ) : null}

      {preview.kind === 'curseforge' && preview.status === 'success' ? (
        <DownloadChart
          platform="CurseForge"
          downloads={preview.downloads}
          ariaLabel="CurseForge downloads"
          action={<PreviewAction href={actionHref} label="View projects" />}
        />
      ) : null}

      {preview.kind === 'curseforge' && preview.status === 'error' ? (
        <div className="social-preview-card__error" role="alert">
          <div>
            <p className="social-preview-card__name">CurseForge data unavailable</p>
            <p className="social-preview-card__error-message">{preview.message}</p>
          </div>
          <PreviewAction href={actionHref} label="Open profile" />
        </div>
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
