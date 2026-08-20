'use client';

import { ReactNode, useState } from 'react';
import Sidebar, { MobileMenuButton } from './Sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'next/navigation';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-cream via-white to-cream/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b-2 border-gold/30 dark:border-brass/30 flex items-center justify-between px-4 sm:px-6 shadow-golden">
          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-2 border-brass/30 rounded-xl bg-cream/30 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-brass/60 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brass dark:text-brass-light"
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
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 text-bronze hover:text-gold dark:text-brass dark:hover:text-gold rounded-xl hover:bg-cream/50 dark:hover:bg-gray-700 transition-all shadow-sm hover:shadow-golden">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-bronze to-gold rounded-full animate-pulse"></span>
            </button>

            {/* User Menu */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l-2 border-gold/30 dark:border-brass/30">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-bronze dark:text-brass-light uppercase tracking-wide">Administrator</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 text-bronze hover:text-gold dark:text-brass-light dark:hover:text-gold rounded-xl hover:bg-cream/50 dark:hover:bg-gray-700 transition-all transform hover:scale-110"
                title="Logout"
              >
                <UserCircleIcon className="w-8 h-8" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content - Removed max-width for full-width table */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-cream/30 via-transparent to-white/50 dark:from-gray-900/50 dark:via-transparent dark:to-gray-800/50">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          
          {/* Decorative elements */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-gold/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-bronze/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        </main>
      </div>
    </div>
  );
}
