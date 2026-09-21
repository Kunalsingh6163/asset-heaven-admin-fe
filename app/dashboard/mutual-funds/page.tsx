'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function MutualFundsPage() {
  const funds = [
    {
      id: 1,
      name: 'HDFC Equity Fund',
      category: 'Large Cap',
      nav: '₹543.20',
      returns: '+12.5%',
      risk: 'Medium',
      status: 'up',
    },
    {
      id: 2,
      name: 'SBI Blue Chip Fund',
      category: 'Large Cap',
      nav: '₹432.80',
      returns: '+10.2%',
      risk: 'Low',
      status: 'up',
    },
    {
      id: 3,
      name: 'ICICI Prudential Mid Cap',
      category: 'Mid Cap',
      nav: '₹234.50',
      returns: '+15.8%',
      risk: 'High',
      status: 'up',
    },
    {
      id: 4,
      name: 'Axis Small Cap Fund',
      category: 'Small Cap',
      nav: '₹156.90',
      returns: '-2.3%',
      risk: 'Very High',
      status: 'down',
    },
    {
      id: 5,
      name: 'Kotak Debt Fund',
      category: 'Debt',
      nav: '₹2,345.60',
      returns: '+6.5%',
      risk: 'Low',
      status: 'up',
    },
    {
      id: 6,
      name: 'Aditya Birla Balanced',
      category: 'Hybrid',
      nav: '₹876.30',
      returns: '+8.9%',
      risk: 'Medium',
      status: 'up',
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      case 'High':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'Very High':
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      default:
        return 'bg-muted text-secondary ';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground ">Mutual Funds</h1>
          <p className="text-sm text-subtle mt-1">
            Explore and manage mutual fund investments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {funds.map((fund) => (
            <div
              key={fund.id}
              className="bg-surface rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {fund.name}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded">
                    {fund.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary ">NAV</span>
                  <span className="text-lg font-bold text-foreground ">
                    {fund.nav}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary ">Returns (1Y)</span>
                  <span
                    className={`text-sm font-semibold ${
                      fund.status === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {fund.returns}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border ">
                  <span className="text-sm text-secondary ">Risk Level</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${getRiskColor(fund.risk)}`}>
                    {fund.risk}
                  </span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
