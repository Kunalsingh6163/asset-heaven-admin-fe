import { NewsApiResponse } from '@/types/news.types';

const NEWS_BASE_URL = 'https://mobulous-tech.vercel.app/api/market-news';

async function fetchNews(url: string, market: string): Promise<NewsApiResponse> {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${market} news: ${response.status} ${response.statusText}`);
  }

  const data: NewsApiResponse = await response.json();
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error(data.message || `Failed to fetch ${market} news`);
  }

  return data;
}

export const newsService = {
  /**
   * Fetch Indian trading market news
   */
  async getIndianNews(): Promise<NewsApiResponse> {
    return fetchNews(NEWS_BASE_URL, 'Indian market');
  },

  /**
   * Fetch global trading market news
   */
  async getGlobalNews(): Promise<NewsApiResponse> {
    return fetchNews(`${NEWS_BASE_URL}/global`, 'global market');
  },

  /**
   * Fetch both Indian and global market news
   */
  async getAllNews(): Promise<{ indianNews: NewsApiResponse; globalNews: NewsApiResponse }> {
    try {
      const [indianNews, globalNews] = await Promise.all([
        this.getIndianNews(),
        this.getGlobalNews(),
      ]);

      return { indianNews, globalNews };
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  },
};
