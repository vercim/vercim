export const revalidate = 21600; // 6 hours

import { HeroSectionWithData } from '@/components/HeroSectionWithData';
import { ProjectsSection } from '@/components/ProjectsSection';

export default function Home() {
  return (
    <main>
      <HeroSectionWithData />
      <ProjectsSection />
    </main>
  );
}
