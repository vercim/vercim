import { PathMarquee } from '@/components/ui/path-marquee';

export function SpiralFooter() {
  return (
    <footer className="spiral-footer" aria-hidden="true" data-reveal>
      <div className="reveal__fade">
        <PathMarquee images={[]} />
      </div>
    </footer>
  );
}
