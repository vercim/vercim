export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export type GithubContributionsResult =
  | {
      status: 'success';
      days: ContributionDay[];
      total: number;
    }
  | {
      status: 'error';
      message: string;
    };

const dayPattern = /<td\b(?=[^>]*\bdata-date="([^"]+)")(?=[^>]*\bdata-level="([0-4])")(?=[^>]*\bclass="ContributionCalendar-day")[^>]*><\/td>\s*<tool-tip\b[^>]*>([^<]+)<\/tool-tip>/g;

export async function fetchGithubContributions(username: string): Promise<GithubContributionsResult> {
  try {
    const res = await fetch(
      `https://github.com/users/${encodeURIComponent(username)}/contributions`,
      {
        headers: {
          'User-Agent': 'vercim/portfolio/1.0 (contact@verc.im)',
        },
        next: { revalidate: 21600 },
      },
    );

    if (!res.ok) {
      console.error('[github] contributions HTTP error:', res.status);
      return {
        status: 'error',
        message: `GitHub returned ${res.status}`,
      };
    }

    const html = await res.text();
    const days: ContributionDay[] = [];

    for (const match of html.matchAll(dayPattern)) {
      const [, date, level, description] = match;
      const countMatch = description.match(/^([\d,]+) contributions?/);
      const count = description.startsWith('No contributions')
        ? 0
        : Number(countMatch?.[1].replaceAll(',', ''));

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(count)) {
        return {
          status: 'error',
          message: 'GitHub contribution data is incomplete',
        };
      }

      days.push({
        date,
        count,
        level: Number(level) as ContributionLevel,
      });
    }

    const cellCount = html.match(/class="ContributionCalendar-day"/g)?.length ?? 0;
    const totalMatch = html.match(
      /id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s*contributions/,
    );
    const total = Number(totalMatch?.[1].replaceAll(',', ''));

    if (days.length === 0 || days.length !== cellCount || !Number.isFinite(total)) {
      return {
        status: 'error',
        message: 'GitHub contribution data is unavailable',
      };
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    return {
      status: 'success',
      days,
      total,
    };
  } catch (error) {
    console.error('[github] contributions exception:', error);
    return {
      status: 'error',
      message: 'Could not reach GitHub',
    };
  }
}
