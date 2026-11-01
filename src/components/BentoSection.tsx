import type { CSSProperties } from 'react';

import { BentoIcon } from '@/components/ui/bento-icon';
import { GitHubHeatmap } from '@/components/ui/github-heatmap';
import { githubAccount } from '@/data/social';
import { fetchGithubContributions } from '@/lib/github';

function revealStyle(index: number): CSSProperties {
  return { '--reveal-delay': `${index * 0.08}s` } as CSSProperties;
}

export async function BentoSection() {
  const github = await fetchGithubContributions(githubAccount);

  return (
    <section id="bento" className="bento" aria-label="More about working with me" data-reveal>
      <div className="bento__grid">
        <article className="bento__card bento__card--wavelength reveal__fade" style={revealStyle(0)}>
          <div className="bento__visual bento__visual--chat">
            <BentoIcon
              name="chat"
              className="bento__lottie bento__lottie--chat"
              segments={{
                idle: 'hover-conversation',
                hover: ['hover-conversation', 'hover-conversation-alt'],
              }}
            />
          </div>
          <div className="bento__content">
            <h2>On the same wavelength</h2>
          </div>
        </article>

        <article className="bento__card bento__card--speed reveal__fade" style={revealStyle(1)}>
          <div className="bento__visual">
            <BentoIcon name="speed" className="bento__lottie" />
          </div>
          <div className="bento__content">
            <h2>Fast product implementation</h2>
          </div>
        </article>

        <article className="bento__card bento__card--payment reveal__fade" style={revealStyle(2)}>
          <div className="bento__visual">
            <BentoIcon name="payment" className="bento__lottie" />
          </div>
          <div className="bento__content">
            <h2>Crypto payments accepted</h2>
          </div>
        </article>

        <article className="bento__card bento__card--github reveal__fade" style={revealStyle(3)}>
          <div className="bento__visual bento__visual--github">
            {github.status === 'success' ? (
              <GitHubHeatmap days={github.days} />
            ) : (
              <span className="bento__unavailable">Activity unavailable right now</span>
            )}
          </div>
        </article>

        <article className="bento__card bento__card--rank reveal__fade" style={revealStyle(4)}>
          <div className="bento__visual">
            <BentoIcon name="rank" className="bento__lottie" />
          </div>
          <div className="bento__content">
            <h2>Verified scripter in Roblox community</h2>
          </div>
        </article>
      </div>
    </section>
  );
}
