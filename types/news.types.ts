export interface NewsArticle {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  type: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
    tag: string;
  } | null;
  relatedTickers?: string[];
}

export interface NewsMeta {
  feed: string;
  scope: string;
  providerRegion: string;
  queries: string[];
  fallbackUsed: boolean;
}

export interface NewsApiResponse {
  success: boolean;
  message: string;
  source: string;
  region: string;
  lang: string;
  requestedCount: number;
  count: number;
  meta: NewsMeta;
  data: NewsArticle[];
}

export interface NewsState {
  indianNews: NewsArticle[];
  globalNews: NewsArticle[];
  loading: boolean;
  error: string | null;
  selectedNewsType: 'indian' | 'global' | 'all';
}
