import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { VideoSection } from '@/components/VideoSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProjectsSection />
      <VideoSection />
    </main>
  );
}
