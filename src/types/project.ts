export interface RepoLanguage {
  name: string;
  percentage: number;
}

export interface RepoCard {
  fullName: string;
  description: string | null;
  sourceUrl: string;
  languages: RepoLanguage[];
}
