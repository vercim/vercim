const sections = [
  { id: 'contacts', label: 'contacts' },
  { id: 'minecraft', label: 'minecraft' },
  { id: 'roblox', label: 'roblox' },
  { id: 'fancy', label: 'fancy' },
];

// The card mark from src/app/icon.svg, drawn in the current text color.
export function SiteHeader() {
  return (
    <header className="site-header">
      <svg className="site-header__mark" viewBox="0 2 16 12" role="img" aria-label="Vercim">
        <path
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16 2H0V14H16V2ZM5 10.5C6.38071 10.5 7.5 9.38071 7.5 8C7.5 6.61929 6.38071 5.5 5 5.5C3.61929 5.5 2.5 6.61929 2.5 8C2.5 9.38071 3.61929 10.5 5 10.5ZM10 5H14V7H10V5ZM14 9H10V11H14V9Z"
        />
      </svg>

      <nav aria-label="Sections">
        <ul className="site-nav">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a className="site-nav__link" href={`#${id}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
