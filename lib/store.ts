import { createUsersStore } from '@/features/users/usersStore';
import { createNewsStore } from '@/features/news/newsStore';
import { createThemeStore } from '@/features/theme/themeStore';

// A fresh set per root provider prevents state leaking between SSR requests.
export const createAppStores = () => ({
  users: createUsersStore(),
  news: createNewsStore(),
  theme: createThemeStore(),
});

export type AppStores = ReturnType<typeof createAppStores>;
