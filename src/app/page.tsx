export const revalidate = 21600; // 6 hours

import { BentoSection } from '@/components/BentoSection';
import { HeroSection } from '@/components/HeroSection';
import { MinecraftSection } from '@/components/MinecraftSection';
import { RobloxSection } from '@/components/RobloxSection';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PointerParallax } from '@/components/ui/pointer-parallax';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="flow-root bg-frame">
          <HeroSection />
          <MinecraftSection />
        </div>
        <RobloxSection />
        <BentoSection />
      </main>
      <SiteFooter />
      <ScrollReveal />
      <PointerParallax />
    </>
  );
}
