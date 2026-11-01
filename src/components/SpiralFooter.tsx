import { PathMarquee } from '@/components/ui/path-marquee';

export function SpiralFooter() {
  return (
    <footer
      className="relative z-2 overflow-hidden bg-dark pt-[clamp(1rem,4vh,3rem)] pb-[clamp(2rem,6vh,5rem)] text-on-dark"
      aria-hidden="true"
    >
      <PathMarquee images={[]} />
    </footer>
  );
}
