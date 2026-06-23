import { config } from '@/data/config';
import { youtubeOverrides } from '@/data/projects';
import { fetchRepos, fetchLatestReleaseUrl, fetchPinnedRepoNames } from '@/lib/github';
import type { RepoCard } from '@/types/project';
import { Layers } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import styles from './ProjectsSection.module.css';

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

      const tags =
        repo.topics.length > 0
          ? repo.topics
          : repo.language
          ? [repo.language.toLowerCase()]
          : [];

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
      };
    })
  );

  // Pinned repos first, preserving GitHub pin order; rest sorted by update date
  const pinnedCards = pinnedNames
    .map((name) => unsorted.find((c) => c.name === name))
    .filter((c): c is RepoCard => c !== undefined);
  const restCards = unsorted.filter((c) => !c.pinned);
  const cards = [...pinnedCards, ...restCards];

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <Layers size={16} color="#444" />
        <span className={styles.title}>projects</span>
        <span className={styles.count}>{cards.length} total</span>
      </div>
      <div className={styles.list}>
        <div className={styles.inner}>
          {cards.length === 0 ? (
            <p className={styles.empty}>no repositories found</p>
          ) : (
            cards.map((card) => <ProjectCard key={card.name} project={card} />)
          )}
        </div>
      </div>
    </section>
  );
}
