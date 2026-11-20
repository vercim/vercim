const sections = ['mods', 'games', 'info'];

export function SiteHeader() {
  return (
    <header id="top" className="flex h-header items-center justify-between gap-6 px-5 font-normal">
      <span
        className="block aspect-[4/3] w-7 shrink-0 bg-ink mask-[url(/site-mark.svg)] mask-contain"
        role="img"
        aria-label="Vercim"
      />

      <nav aria-label="Sections">
        <ul className="site-nav" role="list">
          {sections.map((id) => (
            <li key={id}>
              <a className="site-nav-link" href={`#${id}`}>{id}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
