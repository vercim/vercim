export const revalidate = 21600; // 6 hours

import { BentoSection } from '@/components/BentoSection';
import { HeroSection } from '@/components/HeroSection';
import { MinecraftSection } from '@/components/MinecraftSection';
import { RobloxSection } from '@/components/RobloxSection';
import { SiteHeader } from '@/components/SiteHeader';
import { SpiralFooter } from '@/components/SpiralFooter';
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
      <SpiralFooter />
      <ScrollReveal />
    </>
  );
}
