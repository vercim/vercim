import { fetchCurseForgeProjects } from '@/lib/curseforge';
import { fetchModrinthProjects } from '@/lib/modrinth';

export interface ModProject {
  title: string;
  iconUrl: string | null;
  downloads: number;
}

export interface ModsOverview {
  totalDownloads: number | null;  // null when no platform answered.
  projects: ModProject[];         // Most downloaded first.
}

// Merges both platforms by project title. Modrinth goes first, so its icon
// wins when a project is published on both.
export async function fetchModsOverview(accounts: {
  modrinth: string;
  curseforge: string;
}): Promise<ModsOverview> {
  const results = await Promise.all([
    fetchModrinthProjects(accounts.modrinth),
    fetchCurseForgeProjects(accounts.curseforge),
  ]);

  const byTitle = new Map<string, ModProject>();
  let answered = 0;

  for (const result of results) {
    if (result.status !== 'success') continue;
    answered += 1;

    for (const project of result.projects) {
      const key = project.title.trim().toLowerCase();
      const known = byTitle.get(key);

      if (known) {
        known.downloads += project.downloads;
        known.iconUrl ??= project.iconUrl;
      } else {
        byTitle.set(key, { ...project });
      }
    }
  }

  const projects = [...byTitle.values()].sort((first, second) => second.downloads - first.downloads);

  return {
    totalDownloads:
      answered > 0 ? projects.reduce((total, project) => total + project.downloads, 0) : null,
    projects,
  };
}
