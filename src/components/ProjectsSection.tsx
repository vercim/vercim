import { config } from '@/data/config';
import { youtubeOverrides } from '@/data/projects';
import { fetchRepos, fetchLatestReleaseUrl, fetchPinnedRepoNames } from '@/lib/github';
import type { RepoCard } from '@/types/project';
import { Layers } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

export async function ProjectsSection() {
  const [repos, pinnedFromApi] = await Promise.all([
    fetchRepos(config.githubUsername),
    fetchPinnedRepoNames(config.githubUsername),
  ]);

  const pinnedNames = pinnedFromApi.length > 0 ? pinnedFromApi : config.pinnedRepos;
  const pinnedSet = new Set(pinnedNames);

  const unsorted: RepoCard[] = await Promise.all(
    repos.map(async (repo) => {
      const releaseUrl = await fetchLatestReleaseUrl(config.githubUsername, repo.name);
      const tags = repo.topics.length > 0 ? repo.topics : repo.language ? [repo.language.toLowerCase()] : [];
      return {
        name: repo.name,
        description: repo.description,
        sourceUrl: repo.html_url,
        projectUrl: repo.homepage || null,
        tags,
        language: repo.language,
        releaseUrl,
        youtubeId: youtubeOverrides[repo.name],
        pinned: pinnedSet.has(repo.name),
        stars: repo.stargazers_count,
      };
    })
  );

  const pinnedCards = pinnedNames
    .map((name) => unsorted.find((c) => c.name === name))
    .filter((c): c is RepoCard => c !== undefined);
  const restCards = unsorted.filter((c) => !c.pinned);
  const cards = [...pinnedCards, ...restCards];

  return (
    <section id="projects" className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-[680px] flex items-center gap-[0.625rem] px-4 pt-8 pb-6">
        <Layers size={16} className="text-faint" />
        <span className="text-[0.8125rem] font-semibold text-faint tracking-[0.04em] uppercase">projects</span>
        <span className="text-[0.6875rem] font-medium text-ghost border border-line-soft px-[0.45rem] py-[0.1rem]">{cards.length} total</span>
      </div>
      <div className="w-full max-w-[680px] px-4 pb-8 flex flex-col gap-[0.625rem]">
        {cards.length === 0 ? (
          <p className="text-[0.8125rem] text-ghost py-8">no repositories found</p>
        ) : (
          cards.map((card) => <ProjectCard key={card.name} project={card} />)
        )}
      </div>
    </section>
  );
}
