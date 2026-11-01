import { PathMarquee } from '@/components/ui/path-marquee';

export function SpiralFooter() {
  return (
    <footer className="spiral-footer" aria-hidden="true">
      <PathMarquee images={[]} />
    </footer>
  );
}
