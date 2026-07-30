export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';
import { Footer } from '@/components/Footer';
import { ProjectsSection } from '@/components/ProjectsSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
