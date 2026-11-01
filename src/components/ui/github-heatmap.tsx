import type { ContributionDay } from '@/lib/github';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const weekCount = 16;

export function GitHubHeatmap({ days }: { days: ContributionDay[] }) {
  const completeDays = days.length - (days.length % 7);
  const visibleDays = days.slice(Math.max(0, completeDays - weekCount * 7), completeDays);

  return (
    <div className="bento__heatmap" role="img" aria-label="GitHub contributions during the last 16 full weeks">
      {visibleDays.map((day) => {
        const date = dateFormatter.format(new Date(`${day.date}T00:00:00Z`));
        const label = day.count === 1 ? '1 contribution' : `${day.count} contributions`;

        return (
          <span
            key={day.date}
            className="bento__day"
            data-level={day.level}
            title={`${label} on ${date}`}
          />
        );
      })}
    </div>
  );
}
