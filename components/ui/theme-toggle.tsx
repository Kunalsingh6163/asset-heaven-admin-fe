"use client";

import { toggleTheme } from "@/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <button 
      type="button" 
      onClick={() => dispatch(toggleTheme())} 
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
    >
      {theme === "light" ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </button>
  );
}
