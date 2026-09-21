"use client";

import { useThemeStore } from "@/lib/hooks";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.mode);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const hydrated = useThemeStore((state) => state.hydrated);

  return (
    <button 
      type="button" 
      onClick={toggleTheme}
      disabled={!hydrated}
      aria-pressed={theme === 'dark'}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="p-2 text-secondary hover:bg-hover rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:opacity-50"
    >
      {theme === "light" ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
}
