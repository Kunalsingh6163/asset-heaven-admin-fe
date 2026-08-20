'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  HomeIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Stocks', href: '/dashboard/stocks', icon: ChartBarIcon },
  { name: 'Mutual Funds', href: '/dashboard/mutual-funds', icon: CurrencyDollarIcon },
  { name: 'News', href: '/dashboard/news', icon: NewspaperIcon },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-0
          w-64 bg-gradient-to-b from-cream via-white to-cream dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
          border-r-2 border-gold/30 dark:border-brass/30
          flex flex-col h-screen
          transition-transform duration-300 ease-in-out
          shadow-golden-lg
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-gold/30 dark:border-brass/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 golden-gradient rounded-lg flex items-center justify-center shadow-golden transform hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gradient-golden block">Asset Heaven</span>
              <span className="text-[10px] text-brass dark:text-brass-light uppercase tracking-wider">Admin Portal</span>
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-bronze hover:text-gold rounded-lg hover:bg-cream/50 dark:hover:bg-gray-700 transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'golden-gradient text-white shadow-golden font-semibold transform scale-[1.02]' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-cream/70 dark:hover:bg-gray-700/70 hover:text-gold dark:hover:text-gold hover:pl-5'
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t-2 border-gold/30 dark:border-brass/30 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-cream/70 dark:hover:bg-gray-700/70 hover:text-bronze dark:hover:text-bronze transition-all hover:pl-5"
          >
            <Cog6ToothIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
            <span className="font-medium">Settings</span>
          </Link>
          
          {/* Decorative element */}
          <div className="mt-4 pt-4 border-t border-gold/20 dark:border-brass/20">
            <div className="flex items-center justify-center gap-2">
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-gold"></div>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile menu button component
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-bronze hover:text-gold rounded-lg hover:bg-cream/50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-golden"
    >
      <Bars3Icon className="w-6 h-6" />
    </button>
  );
}
