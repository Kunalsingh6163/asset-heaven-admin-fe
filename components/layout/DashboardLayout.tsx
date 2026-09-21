'use client';

import { ReactNode, useState } from 'react';
import Sidebar, { MobileMenuButton } from './Sidebar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BellIcon } from '@heroicons/react/24/outline';
import AdminMenu from './AdminMenu';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-surface border-b-2 border-border flex items-center justify-between px-4 sm:px-6 shadow-sm">
          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
          
          {/* Logo/Title - Centered on mobile, left on desktop */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <h1 className="text-xl font-bold text-gradient-vibrant">Asset Heaven</h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button className="relative p-2 text-secondary hover:text-pink rounded-xl hover:bg-muted transition-all shadow-sm hover:shadow-pink">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-lime to-pink rounded-full animate-pulse"></span>
            </button>

            {/* User Menu */}
            <AdminMenu />
          </div>
        </header>
        
        {/* Page Content - Removed max-width for full-width table */}
        <main className="flex-1 overflow-y-auto bg-canvas">
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
