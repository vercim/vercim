import Image from 'next/image';

import { revealDelay } from '@/components/ui/reveal-style';

interface SectionIconsProps {
  icons: { title: string; iconUrl: string; link?: string }[];
  delay?: number;
  unoptimized?: boolean;
}

export function SectionIcons({ icons, delay = 0, unoptimized }: SectionIconsProps) {
  if (icons.length === 0) return null;

  return (
    <ul className="section-icons" role="list">
      {icons.map(({ title, iconUrl, link }, index) => {
        const icon = (
          <Image
            className="section-icon"
            src={iconUrl}
            alt={title}
            width={96}
            height={96}
            unoptimized={unoptimized || iconUrl.endsWith('.gif')}
          />
        );

        return (
          <li key={title} className="reveal__fade" style={revealDelay(delay + index * 0.08)}>
            {link ? <a className="block rounded-xl" href={link}>{icon}</a> : icon}
          </li>
        );
      })}
    </ul>
  );
}
