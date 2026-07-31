export interface ModrinthStats {
  totalDownloads: number;
  projectDownloads: number[];
}

export type ModrinthStatsResult =
  | {
      status: 'success';
      stats: ModrinthStats;
    }
  | {
      status: 'error';
      message: string;
    };

interface ModrinthProject {
  id?: string;
  downloads?: number;
  published?: string;
}

export async function fetchModrinthStats(username: string): Promise<ModrinthStatsResult> {
  try {
    const res = await fetch(
      `https://api.modrinth.com/v2/user/${encodeURIComponent(username)}/projects`,
      {
        headers: {
          'User-Agent': 'vercim/portfolio/1.0 (contact@verc.im)',
        },
        next: { revalidate: 21600 },
      },
    );

    if (!res.ok) {
      console.error('[modrinth] projects HTTP error:', res.status);
      return {
        status: 'error',
        message: `Modrinth API returned ${res.status}`,
      };
    }

    const payload: unknown = await res.json();

    if (!Array.isArray(payload)) {
      return {
        status: 'error',
        message: 'Modrinth project data is unavailable',
      };
    }

    const projects = payload as ModrinthProject[];
    const normalizedProjects = projects
      .filter(
        (project): project is ModrinthProject & { id: string; downloads: number } =>
          Boolean(project.id) &&
          typeof project.downloads === 'number' &&
          Number.isFinite(project.downloads),
      )
      .sort((first, second) => {
        const firstPublished = first.published ? Date.parse(first.published) : 0;
        const secondPublished = second.published ? Date.parse(second.published) : 0;
        return firstPublished - secondPublished;
      });

    if (normalizedProjects.length !== projects.length) {
      return {
        status: 'error',
        message: 'Modrinth project data is incomplete',
      };
    }

    const projectDownloads = normalizedProjects.map((project) => project.downloads);

    return {
      status: 'success',
      stats: {
        totalDownloads: projectDownloads.reduce((total, downloads) => total + downloads, 0),
        projectDownloads: projectDownloads.length > 0 ? projectDownloads : [0],
      },
    };
  } catch (error) {
    console.error('[modrinth] projects exception:', error);
    return {
      status: 'error',
      message: 'Could not reach Modrinth API',
    };
  }
}
