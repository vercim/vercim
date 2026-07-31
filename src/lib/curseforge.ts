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

interface CurseForgeAuthorResponse {
  username?: string;
  projects?: {
    id?: number;
  }[];
}

interface CurseForgeProjectResponse {
  id?: number;
  created_at?: string;
  downloads?: {
    total?: number;
  };
}

const CF_WIDGET_HEADERS = {
  'User-Agent': 'vercim/portfolio/1.0 (contact@verc.im)',
};

export async function fetchCurseForgeStats(author: string): Promise<CurseForgeStatsResult> {
  try {
    const authorRes = await fetch(
      `https://api.cfwidget.com/author/search/${encodeURIComponent(author)}`,
      {
        headers: CF_WIDGET_HEADERS,
        next: { revalidate: 21600 },
      },
    );

    if (!authorRes.ok) {
      console.error('[curseforge] public author HTTP error:', authorRes.status);
      return {
        status: 'error',
        message: `CurseForge profile service returned ${authorRes.status}`,
      };
    }

    const authorPayload: CurseForgeAuthorResponse = await authorRes.json();
    const projectIds = authorPayload.projects
      ?.map((project) => project.id)
      .filter((id): id is number => typeof id === 'number');

    if (
      authorPayload.username?.toLowerCase() !== author.toLowerCase() ||
      !projectIds ||
      projectIds.length === 0
    ) {
      return {
        status: 'error',
        message: 'CurseForge projects were not found',
      };
    }

    const projects = await Promise.all(
      [...new Set(projectIds)].map(async (projectId) => {
        const projectRes = await fetch(`https://api.cfwidget.com/${projectId}`, {
          headers: CF_WIDGET_HEADERS,
          next: { revalidate: 21600 },
        });

        if (!projectRes.ok) {
          throw new Error(`Project ${projectId} returned ${projectRes.status}`);
        }

        return projectRes.json() as Promise<CurseForgeProjectResponse>;
      }),
    );

    const normalizedProjects = projects
      .filter(
        (
          project,
        ): project is CurseForgeProjectResponse & {
          id: number;
          downloads: { total: number };
        } =>
          typeof project.id === 'number' &&
          typeof project.downloads?.total === 'number' &&
          Number.isFinite(project.downloads.total),
      )
      .sort((first, second) => {
        const firstCreated = first.created_at ? Date.parse(first.created_at) : 0;
        const secondCreated = second.created_at ? Date.parse(second.created_at) : 0;
        return firstCreated - secondCreated;
      });

    if (normalizedProjects.length !== projects.length) {
      return {
        status: 'error',
        message: 'CurseForge project data is incomplete',
      };
    }

    const projectDownloads = normalizedProjects.map((project) => project.downloads.total);

    return {
      status: 'success',
      stats: {
        totalDownloads: projectDownloads.reduce((total, downloads) => total + downloads, 0),
        projectDownloads,
      },
    };
  } catch (error) {
    console.error('[curseforge] public profile exception:', error);
    return {
      status: 'error',
      message: 'Could not reach CurseForge profile service',
    };
  }
}
