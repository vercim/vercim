export const revalidate = 21600; // 6 hours

import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { VideoSection } from '@/components/VideoSection';
import { Footer } from '@/components/Footer';
import { ScrollNav } from '@/components/ScrollNav';

export default function Home() {
  return (
    <>
      <ScrollNav />
      <main>
        <HeroSection />
        <ProjectsSection />
        <VideoSection />
      </main>
      <Footer />
    </>
  );
}
