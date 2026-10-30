export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="site-frame">
      <main className="site-frame__canvas">
        <HeroSection />
      </main>
    </div>
  );
}
