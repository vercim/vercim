export interface RepoLanguage {
  name: string;
  percentage: number;
}

export interface RepoCard {
  fullName: string;
  description: string | null;
  sourceUrl: string;
  projectUrl: string | null;
  license: string | null;
  languages: RepoLanguage[];
  updatedAt: string;
}
