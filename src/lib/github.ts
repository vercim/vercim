export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  archived: boolean;
  fork: boolean;
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`,
      { headers: githubHeaders(), next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const data: GitHubRepo[] = await res.json();
    // exclude forks, archived repos, and the profile README repo
    return data.filter((r) => !r.fork && !r.archived && r.name !== username);
  } catch {
    return [];
  }
}

// Returns the names of the user's pinned repositories (up to 6).
// Requires GITHUB_TOKEN — returns [] when running unauthenticated (local dev).
export async function fetchPinnedRepoNames(username: string): Promise<string[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const query = `{ repositoryOwner(login: "${username}") { ... on User { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name } } } } ... on Organization { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name } } } } } }`;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      console.error('[github] pinnedItems HTTP error:', res.status, await res.text());
      return [];
    }
    const json = await res.json();
    if (json.errors) {
      console.error('[github] pinnedItems GraphQL errors:', JSON.stringify(json.errors));
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const names = (json.data?.repositoryOwner?.pinnedItems?.nodes ?? []).map((n: any) => n.name as string);
    console.log('[github] pinnedItems resolved:', names);
    return names;
  } catch (e) {
    console.error('[github] pinnedItems exception:', e);
    return [];
  }
}

// Returns the URL of the latest release page, or null if none exist.
export async function fetchLatestReleaseUrl(
  username: string,
  repo: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repo}/releases/latest`,
      { headers: githubHeaders(), next: { revalidate: 21600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.html_url as string) ?? null;
  } catch {
    return null;
  }
}
