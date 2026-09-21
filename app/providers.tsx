'use client';

import { useEffect, useState } from 'react';
import { createAppStores } from '@/lib/store';
import { StoresContext } from '@/lib/hooks';
import { getPreferredTheme, readThemePreference } from '@/features/theme/themeStore';
import { getSession, SESSION_CHANGED } from '@/services/api/session';

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  const [stores] = useState(createAppStores);

  useEffect(() => {
    const applyTheme = () => {
      const { mode } = stores.theme.getState();
      document.documentElement.classList.toggle('dark', mode === 'dark');
      document.documentElement.style.colorScheme = mode;
    };
    stores.theme.getState().syncTheme(getPreferredTheme());
    applyTheme();
    const unsubscribe = stores.theme.subscribe(applyTheme);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
      if (!readThemePreference()) stores.theme.getState().syncTheme(getPreferredTheme());
    };
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme' || event.key === null) stores.theme.getState().syncTheme(getPreferredTheme());
    };
    const onSessionChange = () => {
      if (!getSession()) {
        stores.users.getState().resetUsers();
        stores.news.getState().resetNews();
      }
    };
    media.addEventListener('change', onSystemChange);
    window.addEventListener('storage', onStorageChange);
    window.addEventListener(SESSION_CHANGED, onSessionChange);
    return () => {
      unsubscribe();
      media.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener(SESSION_CHANGED, onSessionChange);
    };
  }, [stores]);

  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>;
}
