import type { ModProject } from '@/lib/mods';

export type CurseForgeProjectsResult =
  | {
      status: 'success';
      projects: ModProject[];
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
  title?: string;
  thumbnail?: string;
  downloads?: {
    total?: number;
  };
}

const CF_WIDGET_HEADERS = {
  'User-Agent': 'vercim/portfolio/1.0 (contact@verc.im)',
};

export async function fetchCurseForgeProjects(author: string): Promise<CurseForgeProjectsResult> {
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

    const responses = await Promise.all(
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

    const projects = responses.filter(
      (
        project,
      ): project is CurseForgeProjectResponse & {
        title: string;
        downloads: { total: number };
      } =>
        typeof project.title === 'string' &&
        typeof project.downloads?.total === 'number' &&
        Number.isFinite(project.downloads.total),
    );

    if (projects.length !== responses.length) {
      return {
        status: 'error',
        message: 'CurseForge project data is incomplete',
      };
    }

    return {
      status: 'success',
      projects: projects.map((project) => ({
        title: project.title,
        iconUrl: project.thumbnail || null,
        downloads: project.downloads.total,
      })),
    };
  } catch (error) {
    console.error('[curseforge] public profile exception:', error);
    return {
      status: 'error',
      message: 'Could not reach CurseForge profile service',
    };
  }
}
