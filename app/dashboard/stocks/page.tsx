'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function StocksPage() {
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,456.80', change: '+5.2%', status: 'up' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: '3,678.90', change: '+3.8%', status: 'up' },
    { symbol: 'HDFC', name: 'HDFC Bank', price: '1,543.20', change: '+2.1%', status: 'up' },
    { symbol: 'INFY', name: 'Infosys', price: '1,432.50', change: '-1.5%', status: 'down' },
    { symbol: 'ITC', name: 'ITC Limited', price: '456.30', change: '+0.8%', status: 'up' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: '876.40', change: '-0.3%', status: 'down' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stocks Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and monitor stock performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        stock.status === 'up'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {stock.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{stock.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{stock.price}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    stock.status === 'up'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <svg
                    className={`w-6 h-6 ${
                      stock.status === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {stock.status === 'up' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    )}
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
