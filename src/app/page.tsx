export const revalidate = 21600; // 6 hours

import { BentoSection } from '@/components/BentoSection';
import { HeroSection } from '@/components/HeroSection';
import { MinecraftSection } from '@/components/MinecraftSection';
import { RobloxSection } from '@/components/RobloxSection';
import { SiteHeader } from '@/components/SiteHeader';
import { PointerParallax } from '@/components/ui/pointer-parallax';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <MinecraftSection />
        <RobloxSection />
        <BentoSection />
      </main>
      <footer className="flex h-header items-center justify-center bg-dark px-5 font-normal text-on-dark">
        <a className="site-nav site-nav-link" href="#top">go back</a>
      </footer>
      <ScrollReveal />
      <PointerParallax />
    </>
  );
}
