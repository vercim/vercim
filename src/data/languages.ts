const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Java: '#b07219',
  Luau: '#00a2ff',
  HTML: '#e34c26',
  CSS: '#663399',
  Python: '#3572a5',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Shell: '#89e051',
  Rust: '#dea584',
  Go: '#00add8',
  Vue: '#41b883',
};

const FALLBACK_LANGUAGE_COLOR = '#8b949e';

export function getLanguageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? FALLBACK_LANGUAGE_COLOR;
}
