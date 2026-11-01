const sections = [
  { id: 'contacts', label: 'contacts' },
  { id: 'mods', label: 'mods' },
  { id: 'games', label: 'games' },
];

// The card mark from src/app/icon.svg, drawn in the current text color.
export function SiteHeader() {
  return (
    <header className="flex h-15 items-center justify-between gap-6 px-[calc((3.75rem_-_1.75rem*0.75)/2)] font-normal">
      <svg
        className="block h-auto w-7 shrink-0 text-ink"
        viewBox="0 2 16 12"
        role="img"
        aria-label="Vercim"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2H0V14H16V2ZM5 10.5C6.38071 10.5 7.5 9.38071 7.5 8C7.5 6.61929 6.38071 5.5 5 5.5C3.61929 5.5 2.5 6.61929 2.5 8C2.5 9.38071 3.61929 10.5 5 10.5ZM10 5H14V7H10V5ZM14 9H10V11H14V9Z"
        />
      </svg>

      <nav aria-label="Sections">
        <ul className="m-0 flex list-none gap-[clamp(0.875rem,2vw,1.75rem)] p-0 text-[clamp(1rem,1.3vw,1.25rem)]">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                className="text-ink underline decoration-1 underline-offset-[0.3em] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                href={`#${id}`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
