import { createStore } from 'zustand/vanilla';
import { userService } from '@/services/api/userService';
import type { UsersState } from '@/types/user.types';

export type UserSortOption = 'name-asc' | 'name-desc' | 'verified' | 'not-verified' | 'none';

export interface UsersStore extends UsersState {
  detailsError: string | null;
  deletionError: string | null;
  lastFetched: number | null;
  searchQuery: string;
  sortOption: UserSortOption;
  currentPage: number;
  pageSize: number;
  fetchUsers: (force?: boolean) => Promise<void>;
  fetchUserById: (id: string) => Promise<void>;
  softDeleteUser: (id: string) => Promise<boolean>;
  permanentlyDeleteUser: (id: string) => Promise<boolean>;
  clearSelectedUser: () => void;
  resetUsers: () => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: UserSortOption) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const initialState = {
  users: [], selectedUser: null, loading: false, detailsLoading: false,
  deletingUserId: null, error: null, detailsError: null, deletionError: null,
  lastFetched: null, searchQuery: '', sortOption: 'none', currentPage: 1, pageSize: 10,
} satisfies Omit<UsersStore, 'fetchUsers' | 'fetchUserById' | 'softDeleteUser' |
  'permanentlyDeleteUser' | 'clearSelectedUser' | 'resetUsers' | 'setSearchQuery' |
  'setSortOption' | 'setCurrentPage' | 'setPageSize'>;

export function createUsersStore() {
  // Each provider owns its requests. Reset invalidates responses from an old session.
  let generation = 0;
  let listRequest = 0;
  let detailRequest = 0;
  let detailUserId: string | null = null;

  return createStore<UsersStore>()((set, get) => {
    const deleteUser = async (id: string, permanent: boolean) => {
      if (get().deletingUserId) return false;
      const session = generation;
      set({ deletingUserId: id, deletionError: null });
      try {
        if (permanent) await userService.permanentlyDeleteUser(id);
        else await userService.softDeleteUser(id);
        if (session !== generation) return false;
        // A list fetched before deletion must not restore the deleted row.
        listRequest++;
        if (detailUserId === id) get().clearSelectedUser();
        set((state) => ({
          users: state.users.filter((user) => user._id !== id),
          deletingUserId: null, loading: false, lastFetched: null,
        }));
        return true;
      } catch (error) {
        if (session !== generation) return false;
        const message = error instanceof Error ? error.message : 'Unable to delete user';
        set({ deletingUserId: null, deletionError: message });
        throw new Error(message);
      }
    };

    return {
      ...initialState,
      fetchUsers: async (force = false) => {
        const state = get();
        if (state.loading || (!force && state.lastFetched !== null && Date.now() - state.lastFetched < 60_000)) return;
        const request = ++listRequest;
        const session = generation;
        set({ loading: true, error: null });
        try {
          const users = await userService.getAllUsers();
          if (session === generation && request === listRequest) {
            set({ users, loading: false, lastFetched: Date.now() });
          }
        } catch (error) {
          if (session === generation && request === listRequest) {
            set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch users' });
          }
        }
      },
      fetchUserById: async (id) => {
        const request = ++detailRequest;
        detailUserId = id;
        const session = generation;
        set({ selectedUser: null, detailsLoading: true, detailsError: null });
        try {
          const user = await userService.getUserById(id);
          if (session === generation && request === detailRequest) set({ selectedUser: user, detailsLoading: false });
        } catch (error) {
          if (session === generation && request === detailRequest) {
            set({ detailsLoading: false, detailsError: error instanceof Error ? error.message : 'Failed to fetch user' });
          }
        }
      },
      softDeleteUser: (id) => deleteUser(id, false),
      permanentlyDeleteUser: (id) => deleteUser(id, true),
      clearSelectedUser: () => {
        detailRequest++;
        detailUserId = null;
        set({ selectedUser: null, detailsLoading: false, detailsError: null });
      },
      resetUsers: () => {
        generation++;
        listRequest++;
        detailRequest++;
        detailUserId = null;
        set(initialState);
      },
      setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
      setSortOption: (sortOption) => set({ sortOption, currentPage: 1 }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),
    };
  });
}
