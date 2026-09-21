'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllNews, setSelectedNewsType } from '@/features/news/newsSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewsTable from '@/components/dashboard/NewsTable';

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { indianNews, globalNews, loading, error, selectedNewsType } = useAppSelector(
    (state) => state.news
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllNews());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllNews());
  };

  const handleNewsTypeChange = (type: 'indian' | 'global' | 'all') => {
    dispatch(setSelectedNewsType(type));
  };

  // Filter and combine news based on selected type
  const filteredNews = useMemo(() => {
    let combinedNews = [];

    if (selectedNewsType === 'indian') {
      combinedNews = indianNews;
    } else if (selectedNewsType === 'global') {
      combinedNews = globalNews;
    } else {
      // Combine both and sort by published date
      combinedNews = [...indianNews, ...globalNews].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return combinedNews.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.publisher.toLowerCase().includes(query) ||
          article.relatedTickers?.some((ticker) =>
            ticker.toLowerCase().includes(query)
          )
      );
    }

    return combinedNews;
  }, [indianNews, globalNews, selectedNewsType, searchQuery]);

  const totalNewsCount = indianNews.length + globalNews.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-vibrant">
              Market News & Updates
            </h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Latest Indian and global trading market news - Total:{' '}
              <span className="text-pink font-bold">{totalNewsCount}</span>
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 lime-gradient disabled:opacity-60 text-white rounded-xl transition-all shadow-lime hover:shadow-lime-lg transform hover:scale-105 font-semibold"
          >
            <svg
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-bold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-xl border-2 border-lime/20 shadow-vibrant">
          {/* News Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => handleNewsTypeChange('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedNewsType === 'all'
                  ? 'vibrant-gradient text-white shadow-vibrant'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All News ({totalNewsCount})
            </button>
            <button
              onClick={() => handleNewsTypeChange('indian')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedNewsType === 'indian'
                  ? 'lime-gradient text-white shadow-lime'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Indian ({indianNews.length})
            </button>
            <button
              onClick={() => handleNewsTypeChange('global')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedNewsType === 'global'
                  ? 'pink-gradient text-white shadow-pink'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Global ({globalNews.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search news, publisher, or ticker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 pl-10 border-2 border-lime/30 rounded-lg focus:outline-none focus:border-lime transition-all font-medium"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* News Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border-2 border-lime/20 shadow-lime">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-lime/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-lime-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Indian Market News</p>
                <p className="text-2xl font-bold text-gradient-lime">
                  {indianNews.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-pink/20 shadow-pink">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-pink-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Global Market News</p>
                <p className="text-2xl font-bold text-gradient-pink">
                  {globalNews.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-lime/20 shadow-vibrant">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-lime/20 to-pink/20 rounded-lg">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Showing Results
                </p>
                <p className="text-2xl font-bold text-gradient-vibrant">
                  {filteredNews.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* News Table */}
        <div className="bg-white rounded-2xl shadow-vibrant-lg border-2 border-lime/20 overflow-hidden">
          <NewsTable
            news={filteredNews}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
