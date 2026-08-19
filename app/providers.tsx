"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "@/lib/store";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setTheme, type ThemeMode } from "@/features/theme/themeSlice";

function ThemeSynchronizer({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      dispatch(setTheme(savedTheme));
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  // Apply dark class to html element for Tailwind dark mode
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return children;
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}><ThemeSynchronizer>{children}</ThemeSynchronizer></Provider>;
}
