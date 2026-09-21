import { createStore } from 'zustand/vanilla';

export type ThemeMode = 'light' | 'dark';

export function readThemePreference(): ThemeMode | null {
  try {
    const saved = window.localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

export function getPreferredTheme(): ThemeMode {
  return readThemePreference() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

export interface ThemeStore {
  mode: ThemeMode;
  hydrated: boolean;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  syncTheme: (mode: ThemeMode) => void;
}

export function createThemeStore() {
  return createStore<ThemeStore>()((set, get) => ({
    mode: 'light',
    hydrated: false,
    setTheme: (mode) => {
      set({ mode, hydrated: true });
      try {
        window.localStorage.setItem('theme', mode);
      } catch {
        // The toggle still works when browser storage is unavailable.
      }
    },
    toggleTheme: () => get().setTheme(get().mode === 'light' ? 'dark' : 'light'),
    syncTheme: (mode) => set({ mode, hydrated: true }),
  }));
}
