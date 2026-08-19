"use client";

import { toggleTheme } from "@/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return <button className="theme-toggle" type="button" onClick={() => dispatch(toggleTheme())} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
    {theme === "light" ? "Dark mode" : "Light mode"}
  </button>;
}
