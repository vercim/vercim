import type { CSSProperties } from 'react';

type Visual = 'typography' | 'layouts' | 'speed' | 'globe' | 'security' | 'mobile';

const cards: { id: string; className: string; visual: Visual }[] = [
  { id: 'typography', className: 'fancy__card--left', visual: 'typography' },
  { id: 'layouts', className: 'fancy__card--layouts', visual: 'layouts' },
  { id: 'speed', className: 'fancy__card--speed', visual: 'speed' },
  { id: 'globe', className: 'fancy__card--right', visual: 'globe' },
  { id: 'security', className: 'fancy__card--security', visual: 'security' },
  { id: 'mobile', className: 'fancy__card--mobile', visual: 'mobile' },
];

function CardVisual({ type }: { type: Visual }) {
  switch (type) {
    case 'typography':
      return <span className="fancy__type" aria-hidden="true">Aa</span>;
    case 'layouts':
      return (
        <div className="fancy__layouts" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      );
    case 'speed':
      return <div className="fancy__speed" aria-hidden="true"><span /></div>;
    case 'globe':
      return (
        <svg className="fancy__globe" viewBox="0 0 120 120" fill="none" aria-hidden="true">
          <circle className="fancy__globe-ring" cx="60" cy="60" r="50" />
          <circle className="fancy__globe-ring" cx="60" cy="60" r="40" />
          <circle cx="60" cy="60" r="29" />
          <ellipse cx="60" cy="60" rx="13" ry="29" />
          <path d="M31 60h58M37 45h46M37 75h46M60 31v58" />
        </svg>
      );
    case 'security':
      return (
        <div className="fancy__security" aria-hidden="true">
          {[0, 1, 2].map((lock) => (
            <span key={lock}>
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
              </svg>
            </span>
          ))}
        </div>
      );
    case 'mobile':
      return (
        <svg className="fancy__phone" viewBox="0 0 48 72" fill="none" aria-hidden="true">
          <rect x="7" y="3" width="34" height="66" rx="7" />
          <circle cx="24" cy="60" r="2" />
        </svg>
      );
  }
}

export function FancySection() {
  return (
    <section id="fancy" className="fancy" aria-label="Advantages" data-reveal>
      <div className="fancy__grid">
        {cards.map(({ id, className, visual }, index) => (
          <article
            key={id}
            className={`fancy__card ${className} reveal__fade`}
            style={{ '--reveal-delay': `${index * 0.08}s` } as CSSProperties}
          >
            <div className="fancy__visual">
              <CardVisual type={visual} />
            </div>
            {/* TODO(owner): Replace both placeholders in every card with your own copy. */}
            <div className="fancy__content">
              <h2>TODO</h2>
              <p>TODO</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
