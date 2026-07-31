export const revalidate = 21600; // 6 hours

import { HeroSectionWithData } from '@/components/HeroSectionWithData';
import { Footer } from '@/components/Footer';
import { ProjectsSection } from '@/components/ProjectsSection';
import { UpgradeBanner } from '@/components/ui/upgrade-banner';

export default function Home() {
  return (
    <main>
      <UpgradeBanner
        className="hero-store-notice"
        buttonText="Visit my Own"
        description="scripts & plugins store"
        href="https://assets.verc.im"
      />
      <HeroSectionWithData />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
