export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <ProjectsSection />
      </main>
      <Footer />
    </>
  );
}
