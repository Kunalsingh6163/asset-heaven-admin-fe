import { createStore } from 'zustand/vanilla';
import { newsService } from '@/services/api/newsService';
import type { NewsState } from '@/types/news.types';

export interface NewsStore extends NewsState {
  searchQuery: string;
  lastFetched: number | null;
  fetchAllNews: (force?: boolean) => Promise<void>;
  setSelectedNewsType: (type: NewsState['selectedNewsType']) => void;
  setSearchQuery: (query: string) => void;
  resetNews: () => void;
}

export function createNewsStore() {
  let generation = 0;
  const initialState: NewsState & { searchQuery: string; lastFetched: number | null } = {
    indianNews: [], globalNews: [], loading: false, error: null,
    selectedNewsType: 'all', searchQuery: '', lastFetched: null,
  };

  return createStore<NewsStore>()((set, get) => ({
    ...initialState,
    fetchAllNews: async (force = false) => {
      const state = get();
      if (state.loading || (!force && state.lastFetched !== null && Date.now() - state.lastFetched < 60_000)) return;
      const request = generation;
      set({ loading: true, error: null });
      try {
        const response = await newsService.getAllNews();
        if (request === generation) {
          set({ indianNews: response.indianNews.data, globalNews: response.globalNews.data,
            loading: false, lastFetched: Date.now() });
        }
      } catch (error) {
        if (request === generation) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch news' });
        }
      }
    },
    setSelectedNewsType: (selectedNewsType) => set({ selectedNewsType }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    resetNews: () => {
      generation++;
      set(initialState);
    },
  }));
}
