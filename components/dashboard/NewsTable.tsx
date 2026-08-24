'use client';

import { NewsArticle } from '@/types/news.types';
import Image from 'next/image';

interface NewsTableProps {
  news: NewsArticle[];
  newsType: 'market' | 'live' | 'all';
  loading?: boolean;
}

export default function NewsTable({ news, newsType, loading = false }: NewsTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime border-t-transparent"></div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 font-medium">No news found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getNewsTypeBadge = (type: string) => {
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-lime/20 text-lime-dark border border-lime/40">
        {type}
      </span>
    );
  };

  const getSourceBadge = (publisher: string) => {
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-pink/20 text-pink-dark border border-pink/40">
        {publisher}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-lime/20">
      <table className="min-w-full divide-y-2 divide-lime/20">
        <thead className="bg-gradient-to-r from-gray-50 to-white">
          <tr>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Publisher
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Published
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Tickers
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {news.map((article, index) => (
            <tr key={article.uuid} className="hover:bg-gray-50 transition-all">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-bold text-gradient-vibrant">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden border-2 border-lime/20">
                  {article.thumbnail?.url ? (
                    <Image
                      src={article.thumbnail.url}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-lime/20 to-pink/20 flex items-center justify-center">
                      <span className="text-2xl">📰</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-5 max-w-md">
                <div className="text-base font-semibold text-gray-900 line-clamp-2">
                  {article.title}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {getSourceBadge(article.publisher)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {getNewsTypeBadge(article.type)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {formatDate(article.publishedAt)}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {article.relatedTickers && article.relatedTickers.length > 0 ? (
                    article.relatedTickers.slice(0, 3).map((ticker, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-700 border border-gray-300"
                      >
                        {ticker}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">No tickers</span>
                  )}
                  {article.relatedTickers && article.relatedTickers.length > 3 && (
                    <span className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-700">
                      +{article.relatedTickers.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink hover:text-pink-dark font-bold transition-all px-4 py-2 rounded-lg hover:bg-pink/10 border border-pink/30 hover:border-pink inline-flex items-center gap-2"
                >
                  Read More
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
