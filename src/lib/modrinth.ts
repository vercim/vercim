import type { ModProject } from '@/lib/mods';

export type ModrinthProjectsResult =
  | {
      status: 'success';
      projects: ModProject[];
    }
  | {
      status: 'error';
      message: string;
    };

interface ModrinthProjectResponse {
  title?: string;
  icon_url?: string | null;
  downloads?: number;
}

export async function fetchModrinthProjects(username: string): Promise<ModrinthProjectsResult> {
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

    const projects = (payload as ModrinthProjectResponse[]).filter(
      (project): project is ModrinthProjectResponse & { title: string; downloads: number } =>
        typeof project.title === 'string' &&
        typeof project.downloads === 'number' &&
        Number.isFinite(project.downloads),
    );

    if (projects.length !== payload.length) {
      return {
        status: 'error',
        message: 'Modrinth project data is incomplete',
      };
    }

    return {
      status: 'success',
      projects: projects.map((project) => ({
        title: project.title,
        iconUrl: project.icon_url ?? null,
        downloads: project.downloads,
      })),
    };
  } catch (error) {
    console.error('[modrinth] projects exception:', error);
    return {
      status: 'error',
      message: 'Could not reach Modrinth API',
    };
  }
}
