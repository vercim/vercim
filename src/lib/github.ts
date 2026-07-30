import type { RepoLanguage } from '@/types/project';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  languages_url: string;
  language: string | null;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  updated_at: string;
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'vercim-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];

  try {
    for (let page = 1; ; page += 1) {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner&page=${page}`,
        { headers: githubHeaders(), next: { revalidate: 21600 } }
      );

      if (!res.ok) {
        return fetchReposFromProfilePage(username);
      }

      const pageRepos: GitHubRepo[] = await res.json();
      repos.push(...pageRepos);

      if (pageRepos.length < 100) break;
    }
  } catch (error) {
    const fallbackRepos = await fetchReposFromProfilePage(username);
    if (fallbackRepos.length > 0) return fallbackRepos;

    console.error('[github] repositories unavailable:', error);
  }

  return repos;
}

export async function fetchRepoLanguages(repo: GitHubRepo): Promise<RepoLanguage[]> {
  if (!repo.languages_url) {
    return fallbackLanguages(repo.language);
  }

  try {
    const res = await fetch(repo.languages_url, {
      headers: githubHeaders(),
      next: { revalidate: 21600 },
    });

    if (!res.ok) {
      console.error(`[github] languages HTTP error for ${repo.full_name}:`, res.status);
      return fallbackLanguages(repo.language);
    }

    const bytesByLanguage: Record<string, number> = await res.json();
    const totalBytes = Object.values(bytesByLanguage).reduce((total, bytes) => total + bytes, 0);

    if (totalBytes === 0) {
      return fallbackLanguages(repo.language);
    }

    return Object.entries(bytesByLanguage)
      .sort(([, firstBytes], [, secondBytes]) => secondBytes - firstBytes)
      .map(([name, bytes]) => ({
        name,
        percentage: (bytes / totalBytes) * 100,
      }));
  } catch (error) {
    console.error(`[github] languages exception for ${repo.full_name}:`, error);
    return fallbackLanguages(repo.language);
  }
}

function fallbackLanguages(language: string | null): RepoLanguage[] {
  if (!language) {
    return [];
  }

  return [{ name: language, percentage: 100 }];
}

async function fetchReposFromProfilePage(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];

  try {
    for (let page = 1; ; page += 1) {
      const res = await fetch(`https://github.com/${username}?tab=repositories&page=${page}`, {
        headers: {
          Accept: 'text/html',
          'User-Agent': 'vercim-portfolio',
        },
        next: { revalidate: 21600 },
      });

      if (!res.ok) {
        throw new Error(`GitHub profile returned ${res.status}`);
      }

      const html = await res.text();
      const pageRepos = parseProfileRepositories(username, html, repos.length);
      repos.push(...pageRepos);

      if (pageRepos.length < 30) break;
    }

    const homepages = await Promise.all(
      repos.map((repo) => fetchRepoHomepage(repo.html_url))
    );

    return repos.map((repo, index) => ({
      ...repo,
      homepage: homepages[index],
    }));
  } catch (error) {
    console.error('[github] profile fallback unavailable:', error);
    return [];
  }
}

function parseProfileRepositories(
  username: string,
  html: string,
  offset: number
): GitHubRepo[] {
  const blocks = html.split(/<li[^>]*itemprop="owns"[^>]*>/).slice(1);

  return blocks.flatMap((block, index) => {
    const name = extractText(block, /itemprop="name codeRepository"[^>]*>([\s\S]*?)<\/a>/);
    const updatedAt = block.match(/<relative-time[^>]*datetime="([^"]+)"/)?.[1];

    if (!name || !updatedAt) return [];

    const description = extractText(
      block,
      /<p[^>]*itemprop="description"[^>]*>([\s\S]*?)<\/p>/
    );
    const language = extractText(
      block,
      /<span[^>]*itemprop="programmingLanguage"[^>]*>([\s\S]*?)<\/span>/
    );
    const licenseName = extractText(
      block,
      /octicon-law[\s\S]{0,1800}?<\/svg>([\s\S]*?)<\/span>/
    );

    return [{
      id: offset + index,
      name,
      full_name: `${username}/${name}`,
      description: description || null,
      html_url: `https://github.com/${username}/${name}`,
      homepage: null,
      languages_url: '',
      language: language || null,
      license: licenseName
        ? {
            name: licenseName,
            spdx_id: normalizeLicense(licenseName),
          }
        : null,
      updated_at: updatedAt,
    }];
  });
}

async function fetchRepoHomepage(repoUrl: string): Promise<string | null> {
  try {
    const res = await fetch(repoUrl, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'vercim-portfolio',
      },
      next: { revalidate: 21600 },
    });

    if (!res.ok) return null;

    const html = await res.text();
    const homepage =
      html.match(/SidebarAbout-module__websiteLink__[^"]*"[^>]*title="([^"]+)"/)?.[1] ??
      html.match(/repository-meta-content[\s\S]{0,800}?href="([^"]+)"/)?.[1];

    return homepage ? decodeHtml(homepage) : null;
  } catch {
    return null;
  }
}

function extractText(html: string, pattern: RegExp): string {
  const value = html.match(pattern)?.[1];
  if (!value) return '';

  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeLicense(name: string): string {
  const licenses: Record<string, string> = {
    'GNU Affero General Public License v3.0': 'AGPL-3.0',
    'GNU General Public License v3.0': 'GPL-3.0',
    'GNU Lesser General Public License v3.0': 'LGPL-3.0',
    'Apache License 2.0': 'Apache-2.0',
    'MIT License': 'MIT',
  };

  return licenses[name] ?? 'NOASSERTION';
}
