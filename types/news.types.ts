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
  };
  relatedTickers?: string[];
}

export interface NewsMeta {
  query: string;
  symbols: string[];
  queries: string[];
  effectiveRegions: string[];
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
  marketNews: NewsArticle[];
  liveNews: NewsArticle[];
  loading: boolean;
  error: string | null;
  selectedNewsType: 'market' | 'live' | 'all';
}
