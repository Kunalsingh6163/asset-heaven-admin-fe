"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon },
  { name: "Stocks", href: "/dashboard/stocks", icon: ChartBarIcon },
  // { name: 'Mutual Funds', href: '/dashboard/mutual-funds', icon: CurrencyDollarIcon },
  { name: "News", href: "/dashboard/news", icon: NewspaperIcon },
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
          w-64 bg-surface
          border-r-2 border-border
          flex flex-col h-screen
          transition-transform duration-300 ease-in-out
          shadow-lg
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b-2 border-border bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 vibrant-gradient rounded-lg flex items-center justify-center shadow-vibrant transform hover:scale-105 transition-transform">
              <span className="text-white font-bold text-lg">AH</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gradient-vibrant block">
                Asset Heaven
              </span>
              <span className="text-[10px] text-secondary uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-secondary hover:text-pink rounded-lg hover:bg-muted transition-all"
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
                  ${
                    isActive
                      ? "vibrant-gradient text-white shadow-vibrant font-semibold transform scale-[1.02]"
                      : "text-foreground hover:bg-muted hover:text-pink hover:pl-5"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "drop-shadow-sm" : ""}`}
                />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-surface animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings at bottom */}
        <div className="p-4 border-t-2 border-border bg-surface">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-muted hover:text-lime transition-all hover:pl-5"
          >
            <Cog6ToothIcon className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
            <span className="font-medium">Settings</span>
          </Link>

          {/* Decorative element */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-lime to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-pink"></div>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-pink to-transparent"></div>
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
      className="lg:hidden p-2 text-secondary hover:text-pink rounded-lg hover:bg-muted transition-all shadow-md hover:shadow-pink"
    >
      <Bars3Icon className="w-6 h-6" />
    </button>
  );
}
