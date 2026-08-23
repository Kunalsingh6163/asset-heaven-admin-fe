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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b-2 border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">
          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
          
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
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
            <button className="relative p-2 text-gray-600 hover:text-pink rounded-xl hover:bg-gray-100 transition-all shadow-sm hover:shadow-pink">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-lime to-pink rounded-full animate-pulse"></span>
            </button>

            {/* User Menu */}
            <div className="hidden sm:flex items-center gap-3 pl-3 border-l-2 border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Administrator</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 text-gray-600 hover:text-pink rounded-xl hover:bg-gray-100 transition-all transform hover:scale-110"
                title="Logout"
              >
                <UserCircleIcon className="w-8 h-8" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content - Removed max-width for full-width table */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          
          {/* Decorative elements */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-lime/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
        </main>
      </div>
    </div>
  );
}
