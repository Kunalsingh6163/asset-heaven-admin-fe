import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NewsState, NewsArticle } from '@/types/news.types';
import { newsService } from '@/services/api';

const initialState: NewsState = {
  marketNews: [],
  liveNews: [],
  loading: false,
  error: null,
  selectedNewsType: 'all',
};

// Async thunks
export const fetchMarketNews = createAsyncThunk(
  'news/fetchMarketNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getMarketNews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch market news'
      );
    }
  }
);

export const fetchLiveNews = createAsyncThunk(
  'news/fetchLiveNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getLiveNews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch live news'
      );
    }
  }
);

export const fetchAllNews = createAsyncThunk(
  'news/fetchAllNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getAllNews();
      return {
        marketNews: response.marketNews.data,
        liveNews: response.liveNews.data,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch news'
      );
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSelectedNewsType: (state, action: { payload: 'market' | 'live' | 'all' }) => {
      state.selectedNewsType = action.payload;
    },
    clearNewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Market News
    builder
      .addCase(fetchMarketNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMarketNews.fulfilled, (state, action) => {
        state.loading = false;
        state.marketNews = action.payload;
      })
      .addCase(fetchMarketNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Live News
    builder
      .addCase(fetchLiveNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveNews.fulfilled, (state, action) => {
        state.loading = false;
        state.liveNews = action.payload;
      })
      .addCase(fetchLiveNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch All News
    builder
      .addCase(fetchAllNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNews.fulfilled, (state, action) => {
        state.loading = false;
        state.marketNews = action.payload.marketNews;
        state.liveNews = action.payload.liveNews;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedNewsType, clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;
