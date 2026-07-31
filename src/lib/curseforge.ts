export interface CurseForgeStats {
  totalDownloads: number;
  projectDownloads: number[];
}

export type CurseForgeStatsResult =
  | {
      status: 'success';
      stats: CurseForgeStats;
    }
  | {
      status: 'error';
      message: string;
    };

interface CurseForgeMod {
  id?: number;
  downloadCount?: number;
  dateCreated?: string;
  authors?: {
    name?: string;
  }[];
}

interface CurseForgeSearchResponse {
  data?: CurseForgeMod[];
  pagination?: {
    index: number;
    pageSize: number;
    resultCount: number;
    totalCount: number;
  };
}

const PAGE_SIZE = 50;

export async function fetchCurseForgeStats(
  gameId: number,
  author: string,
): Promise<CurseForgeStatsResult> {
  const apiKey = process.env.CURSEFORGE_API_KEY;

  if (!apiKey) {
    return {
      status: 'error',
      message: 'CurseForge API key is not configured',
    };
  }

  const projects: (CurseForgeMod & { id: number; downloadCount: number })[] = [];

  try {
    for (let index = 0; index < 10000; index += PAGE_SIZE) {
      const params = new URLSearchParams({
        gameId: String(gameId),
        searchFilter: author,
        index: String(index),
        pageSize: String(PAGE_SIZE),
      });
      const res = await fetch(`https://api.curseforge.com/v1/mods/search?${params}`, {
        headers: {
          Accept: 'application/json',
          'x-api-key': apiKey,
        },
        next: { revalidate: 21600 },
      });

      if (!res.ok) {
        console.error('[curseforge] projects HTTP error:', res.status);
        return {
          status: 'error',
          message: `CurseForge API returned ${res.status}`,
        };
      }

      const payload: CurseForgeSearchResponse = await res.json();

      if (!Array.isArray(payload.data) || !payload.pagination) {
        return {
          status: 'error',
          message: 'CurseForge project data is unavailable',
        };
      }

      const authorProjects = payload.data.filter(
        (project): project is CurseForgeMod & { id: number; downloadCount: number } =>
          typeof project.id === 'number' &&
          typeof project.downloadCount === 'number' &&
          Number.isFinite(project.downloadCount) &&
          Boolean(
            project.authors?.some(
              (projectAuthor) => projectAuthor.name?.toLowerCase() === author.toLowerCase(),
            ),
          ),
      );
      projects.push(...authorProjects);

      const { resultCount, totalCount } = payload.pagination;
      if (resultCount < PAGE_SIZE || index + resultCount >= totalCount) break;
    }

    if (projects.length === 0) {
      return {
        status: 'error',
        message: 'CurseForge projects were not found',
      };
    }

    projects.sort((first, second) => {
      const firstCreated = first.dateCreated ? Date.parse(first.dateCreated) : 0;
      const secondCreated = second.dateCreated ? Date.parse(second.dateCreated) : 0;
      return firstCreated - secondCreated;
    });

    const projectDownloads = projects.map((project) => project.downloadCount);

    return {
      status: 'success',
      stats: {
        totalDownloads: projectDownloads.reduce((total, downloads) => total + downloads, 0),
        projectDownloads,
      },
    };
  } catch (error) {
    console.error('[curseforge] projects exception:', error);
    return {
      status: 'error',
      message: 'Could not reach CurseForge API',
    };
  }
}
