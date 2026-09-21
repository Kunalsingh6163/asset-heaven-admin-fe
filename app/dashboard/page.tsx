"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUsersStore } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const users = useUsersStore((state) => state.users);
  const loading = useUsersStore((state) => state.loading);
  const error = useUsersStore((state) => state.error);
  const fetchUsers = useUsersStore((state) => state.fetchUsers);
  const stats = {
    totalUsers: users.length,
    verifiedUsers: users.filter((user) => user.isEmailVerified).length,
    adminUsers: users.filter((user) => user.admin).length,
  };

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const handlealluser = () => {
    router.push("/dashboard/users");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="vibrant-gradient rounded-2xl p-10 md:p-12 text-white shadow-vibrant-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
              Welcome to Asset Heaven
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Manage your assets, users, and investments all in one place
            </p>
            {loading && (
              <div className="mt-4 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span className="text-sm">Loading dashboard data...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-red-600 dark:text-red-300"
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
                <p className="font-bold text-red-800 dark:text-red-300">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid - Expanded Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Total Users */}
          <div className="bg-surface rounded-2xl p-8 shadow-lime border-2 border-lime/20 hover:shadow-lime-lg transition-all hover:scale-[1.02] transform">
            <div className="flex items-center justify-between">
              <div className="flex-1" onClick={handlealluser}>
                <p className="text-sm text-secondary font-medium uppercase tracking-wide mb-2">
                  Total Users
                </p>
                <p className="text-5xl font-bold text-gradient-vibrant mt-2 mb-3">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stats.totalUsers.toLocaleString()
                  )}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-green-600 dark:text-green-300">
                    {loading ? "..." : `${stats.verifiedUsers} verified`}
                  </span>
                  {/* <span className="text-subtle">•</span>
                  <span className="text-secondary">
                    {loading ? '...' : `${stats.adminUsers} admin`}
                  </span> */}
                </div>
              </div>
              <div className="w-16 h-16 lime-gradient rounded-2xl flex items-center justify-center shadow-lime transform hover:rotate-12 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Stocks */}
          <div className="bg-surface rounded-2xl p-8 shadow-pink border-2 border-pink/20 hover:shadow-pink-lg transition-all hover:scale-[1.02] transform">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-secondary font-medium uppercase tracking-wide mb-2">
                  Active Stocks
                </p>
                <p className="text-5xl font-bold text-gradient-pink mt-2 mb-3">
                  456
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 font-semibold">
                  ↑ 8% from last month
                </p>
              </div>
              <div className="w-16 h-16 pink-gradient rounded-2xl flex items-center justify-center shadow-pink transform hover:rotate-12 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Mutual Funds */}
          <div className="bg-surface rounded-2xl p-8 shadow-lime border-2 border-lime/20 hover:shadow-lime-lg transition-all hover:scale-[1.02] transform">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-secondary font-medium uppercase tracking-wide mb-2">
                  Mutual Funds
                </p>
                <p className="text-5xl font-bold text-gradient-lime mt-2 mb-3">
                  89
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 font-semibold">
                  ↑ 15% from last month
                </p>
              </div>
              <div className="w-16 h-16 lime-gradient rounded-2xl flex items-center justify-center shadow-lime transform hover:rotate-12 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
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
            </div>
          </div>

          {/* Verified Users */}
          <div className="bg-surface rounded-2xl p-8 shadow-vibrant border-2 border-pink/20 hover:shadow-vibrant-lg transition-all hover:scale-[1.02] transform">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-secondary font-medium uppercase tracking-wide mb-2">
                  Verified Users
                </p>
                <p className="text-5xl font-bold text-gradient-pink mt-2 mb-3">
                  {loading ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    stats.verifiedUsers
                  )}
                </p>
                <p className="text-xs text-secondary font-semibold">
                  {loading
                    ? "..."
                    : `${stats.totalUsers > 0 ? ((stats.verifiedUsers / stats.totalUsers) * 100).toFixed(1) : 0}% verified`}
                </p>
              </div>
              <div className="w-16 h-16 vibrant-gradient rounded-2xl flex items-center justify-center shadow-vibrant transform hover:rotate-12 transition-transform">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-surface rounded-2xl p-8 shadow-lime border-2 border-lime/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gradient-lime">
                Recent News
              </h3>
              <div className="w-10 h-10 rounded-xl bg-lime/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-lime"
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
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-0 hover:bg-canvas p-3 rounded-lg transition-all"
                >
                  <div className="w-2 h-2 bg-lime rounded-full mt-2 shadow-md animate-pulse"></div>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground">
                      Market Update #{item}
                    </p>
                    <p className="text-sm text-secondary mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-8 shadow-pink border-2 border-pink/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gradient-pink">
                Top Performing Stocks
              </h3>
              <div className="w-10 h-10 rounded-xl bg-pink/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-pink"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { name: "RELIANCE", change: "+5.2%", color: "text-green-600 dark:text-green-300" },
                { name: "TCS", change: "+3.8%", color: "text-green-600 dark:text-green-300" },
                { name: "HDFC BANK", change: "+2.1%", color: "text-green-600 dark:text-green-300" },
              ].map((stock) => (
                <div
                  key={stock.name}
                  className="flex items-center justify-between pb-4 border-b border-border last:border-0 hover:bg-canvas p-3 rounded-lg transition-all"
                >
                  <span className="text-base font-semibold text-foreground">
                    {stock.name}
                  </span>
                  <span
                    className={`text-base font-bold ${stock.color} bg-green-50 dark:bg-green-950/40 px-3 py-1 rounded-lg`}
                  >
                    {stock.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
