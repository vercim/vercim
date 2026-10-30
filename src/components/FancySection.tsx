import { PathMarquee } from '@/components/ui/path-marquee';
import { fancyImages } from '@/data/fancy';

export function FancySection() {
  return (
    <section id="fancy" className="fancy" aria-label="Things I like">
      <PathMarquee images={fancyImages} />
    </section>
  );
}
