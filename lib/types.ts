export type Category =
  | "news"
  | "trends"
  | "education"
  | "deep-dive"
  | "model-release";

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  accent?: string;
  links?: {
    x?: string;
    site?: string;
    github?: string;
  };
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  category: Category;
  date: string;
  authors: string[];
  tags: string[];
  featured: boolean;
  model?: string;
  draft: boolean;
  readingTime: number;
}

export interface Post extends PostMeta {
  body: string;
}

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

export type ModelSource = "huggingface" | "openrouter" | "both";

export interface ModelEntry {
  id: string;
  slug: string;
  name: string;
  org: string;
  source: ModelSource;
  discoveredAt: string;
  releasedAt: string;
  pipeline: string;
  modality?: string;
  context?: number;
  likes?: number;
  downloads?: number;
  tags?: string[];
  summary?: string;
  url: string;
}

export interface Registry {
  updatedAt: string;
  modelCount: number;
  models: ModelEntry[];
}
