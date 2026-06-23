export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
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
      { headers: githubHeaders(), cache: 'force-cache' }
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

  const query = `{ user(login: "${username}") { pinnedItems(first: 6, types: REPOSITORY) { nodes { ... on Repository { name } } } } }`;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (json.data?.user?.pinnedItems?.nodes ?? []).map((n: any) => n.name as string);
  } catch {
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
      { headers: githubHeaders(), cache: 'force-cache' }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data.html_url as string) ?? null;
  } catch {
    return null;
  }
}
