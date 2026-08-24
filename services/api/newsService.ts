import { NewsApiResponse } from '@/types/news.types';

const NEWS_BASE_URL = 'https://mobulous-tech.vercel.app/api/market-news';

export const newsService = {
  /**
   * Fetch market news
   */
  async getMarketNews(): Promise<NewsApiResponse> {
    try {
      const response = await fetch(NEWS_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch market news: ${response.statusText}`);
      }

      const data: NewsApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market news:', error);
      throw error;
    }
  },

  /**
   * Fetch live trading news
   */
  async getLiveNews(): Promise<NewsApiResponse> {
    try {
      const response = await fetch(`${NEWS_BASE_URL}/live`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch live news: ${response.statusText}`);
      }

      const data: NewsApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching live news:', error);
      throw error;
    }
  },

  /**
   * Fetch all news (both market and live)
   */
  async getAllNews(): Promise<{ marketNews: NewsApiResponse; liveNews: NewsApiResponse }> {
    try {
      const [marketNews, liveNews] = await Promise.all([
        this.getMarketNews(),
        this.getLiveNews(),
      ]);

      return { marketNews, liveNews };
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  },
};
