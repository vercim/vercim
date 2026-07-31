export const revalidate = 21600; // 6 hours

import { HeroSectionWithData } from '@/components/HeroSectionWithData';
import { Footer } from '@/components/Footer';
import { ProjectsSection } from '@/components/ProjectsSection';

export default function Home() {
  return (
    <main>
      <HeroSectionWithData />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
