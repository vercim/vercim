export interface RepoCard {
  name: string;
  description: string | null;
  sourceUrl: string;
  tags: string[];
  language: string | null;
  releaseUrl: string | null;
  youtubeId?: string;
  pinned: boolean;
}
