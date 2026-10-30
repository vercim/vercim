export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';
import { MinecraftSection } from '@/components/MinecraftSection';
import { RobloxSection } from '@/components/RobloxSection';
import { SiteHeader } from '@/components/SiteHeader';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <MinecraftSection />
        <RobloxSection />
      </main>
    </>
  );
}
