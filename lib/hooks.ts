'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import type { AppStores } from './store';
import type { UsersStore } from '@/features/users/usersStore';
import type { NewsStore } from '@/features/news/newsStore';
import type { ThemeStore } from '@/features/theme/themeStore';

export const StoresContext = createContext<AppStores | null>(null);

function useAppStores() {
  const stores = useContext(StoresContext);
  if (!stores) throw new Error('Store hooks must be used within AppProviders');
  return stores;
}

export function useUsersStore<T>(selector: (state: UsersStore) => T) {
  return useStore(useAppStores().users, selector);
}

export function useNewsStore<T>(selector: (state: NewsStore) => T) {
  return useStore(useAppStores().news, selector);
}

export function useThemeStore<T>(selector: (state: ThemeStore) => T) {
  return useStore(useAppStores().theme, selector);
}
