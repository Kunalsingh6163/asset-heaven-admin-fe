import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NewsState } from '@/types/news.types';
import { newsService } from '@/services/api/newsService';

const initialState: NewsState = {
  indianNews: [],
  globalNews: [],
  loading: false,
  error: null,
  selectedNewsType: 'all',
};

// Async thunks
export const fetchIndianNews = createAsyncThunk(
  'news/fetchIndianNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getIndianNews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch Indian market news'
      );
    }
  }
);

export const fetchGlobalNews = createAsyncThunk(
  'news/fetchGlobalNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await newsService.getGlobalNews();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch global market news'
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
        indianNews: response.indianNews.data,
        globalNews: response.globalNews.data,
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
    setSelectedNewsType: (state, action: { payload: 'indian' | 'global' | 'all' }) => {
      state.selectedNewsType = action.payload;
    },
    clearNewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Indian Market News
    builder
      .addCase(fetchIndianNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIndianNews.fulfilled, (state, action) => {
        state.loading = false;
        state.indianNews = action.payload;
      })
      .addCase(fetchIndianNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Global Market News
    builder
      .addCase(fetchGlobalNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalNews.fulfilled, (state, action) => {
        state.loading = false;
        state.globalNews = action.payload;
      })
      .addCase(fetchGlobalNews.rejected, (state, action) => {
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
        state.indianNews = action.payload.indianNews;
        state.globalNews = action.payload.globalNews;
      })
      .addCase(fetchAllNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedNewsType, clearNewsError } = newsSlice.actions;
export default newsSlice.reducer;
