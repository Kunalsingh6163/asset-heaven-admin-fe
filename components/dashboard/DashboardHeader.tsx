'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardHeader() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear any auth tokens/session data here
    router.push('/login');
  };

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-border-strong rounded-lg bg-canvas text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-subtle"
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

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 text-secondary hover:bg-hover rounded-lg transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-border ">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground ">Admin User</p>
            <p className="text-xs text-subtle ">Administrator</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1 text-secondary hover:bg-hover rounded-lg transition-colors"
            title="Logout"
          >
            <UserCircleIcon className="w-8 h-8" />
          </button>
        </div>
      </div>
    </header>
  );
}
