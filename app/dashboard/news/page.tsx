'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: 'Market Rally Continues as Tech Stocks Surge',
      description: 'Technology sector leads gains with major indices posting strong performance.',
      category: 'Market',
      time: '2 hours ago',
      image: '📈', 
    },
    {
      id: 2,
      title: 'New IPO Launch Expected Next Quarter',
      description: 'Three major companies announce plans for public listing in Q2.',
      category: 'IPO',
      time: '5 hours ago',
      image: '🚀',
    },
    {
      id: 3,
      title: 'RBI Announces Policy Rate Decision',
      description: 'Central bank maintains repo rate, focuses on inflation control.',
      category: 'Policy',
      time: '1 day ago',
      image: '🏦',
    },
    {
      id: 4,
      title: 'Mutual Fund Investments Reach New High',
      description: 'SIP contributions hit record levels in recent months.',
      category: 'Mutual Funds',
      time: '2 days ago',
      image: '💰',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Latest News</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with the latest market news and updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{news.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{news.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {news.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
