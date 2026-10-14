import { getSocialAccount } from '@/data/social';
import { fetchRepoLanguages, fetchRepos } from '@/lib/github';
import type { RepoCard } from '@/types/project';
import { ProjectsBento } from './ProjectsBento';

export async function ProjectsSection() {
  const repos = await fetchRepos(getSocialAccount('github'));
  const cards: RepoCard[] = await Promise.all(
    repos.map(async (repo) => {
      const languages = await fetchRepoLanguages(repo);

      return {
        fullName: repo.full_name,
        description: repo.description,
        sourceUrl: repo.html_url,
        languages,
      };
    })
  );

  return (
    <section id="projects" className="projects-section">
      <div className="projects-section__inner">
        {cards.length > 0 ? (
          <ProjectsBento cards={cards} />
        ) : (
          <p className="projects-empty">Repositories are unavailable right now.</p>
        )}
      </div>
    </section>
  );
}
