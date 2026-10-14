import type { CSSProperties } from 'react';
import { getLanguageColor } from '@/data/languages';
import type { RepoLanguage } from '@/types/project';

interface Props {
  languages: RepoLanguage[];
}

const LEGEND_LIMIT = 3;

function formatPercentage(percentage: number) {
  if (percentage < 0.1) return '<0.1%';
  if (percentage >= 10) return `${Math.round(percentage)}%`;
  return `${percentage.toFixed(1)}%`;
}

function colorStyle(name: string) {
  return { '--language-color': getLanguageColor(name) } as CSSProperties;
}

export function LanguageBar({ languages }: Props) {
  if (languages.length === 0) return null;

  const listed = languages.slice(0, LEGEND_LIMIT);
  const hiddenCount = languages.length - listed.length;
  const summary = languages
    .map((language) => `${language.name} ${formatPercentage(language.percentage)}`)
    .join(', ');

  return (
    <div className="language-bar">
      <div className="language-bar__track" role="img" aria-label={summary}>
        {languages.map((language) => (
          <span
            key={language.name}
            className="language-bar__segment"
            style={{ ...colorStyle(language.name), flex: `${language.percentage} 1 0` }}
          />
        ))}
      </div>

      <ul className="language-bar__legend" aria-hidden="true">
        {listed.map((language) => (
          <li key={language.name} style={colorStyle(language.name)}>
            <span className="language-bar__dot" />
            <span>{language.name}</span>
            <span className="language-bar__percentage">
              {formatPercentage(language.percentage)}
            </span>
          </li>
        ))}
        {hiddenCount > 0 && <li className="language-bar__more">+{hiddenCount}</li>}
      </ul>
    </div>
  );
}
