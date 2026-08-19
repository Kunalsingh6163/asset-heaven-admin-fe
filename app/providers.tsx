"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";

function ThemeSynchronizer({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return children;
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Provider store={store}><ThemeSynchronizer>{children}</ThemeSynchronizer></Provider>;
}
