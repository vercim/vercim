export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';
import { MinecraftSection } from '@/components/MinecraftSection';
import { CloudShader } from '@/components/ui/cloud-shader';

export default function Home() {
  return (
    <div className="site-frame">
      <main className="site-frame__canvas">
        <div className="site-frame__sky" aria-hidden="true">
          <CloudShader />
        </div>
        <HeroSection />
        <MinecraftSection />
      </main>
    </div>
  );
}
