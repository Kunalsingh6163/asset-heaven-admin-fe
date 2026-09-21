'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUsersStore } from '@/lib/hooks';
import type { UserSortOption } from '@/features/users/usersStore';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/dashboard/UserTable';
import UserDetailsModal from '@/components/dashboard/UserDetailsModal';
import Pagination from '@/components/ui/Pagination';

type SortOption = UserSortOption;

export default function UsersPage() {
  const { users, selectedUser, loading, detailsLoading, deletingUserId, error,
    detailsError, deletionError, searchQuery, sortOption, currentPage, pageSize,
    fetchUsers, fetchUserById, softDeleteUser, permanentlyDeleteUser, clearSelectedUser,
    setSearchQuery, setSortOption, setCurrentPage, setPageSize } = useUsersStore((state) => state);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    void fetchUsers();
    return () => clearSelectedUser();
  }, [fetchUsers, clearSelectedUser]);

  // Combined filtering and sorting logic
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'verified':
        result = result.filter(user => user.isEmailVerified);
        break;
      case 'not-verified':
        result = result.filter(user => !user.isEmailVerified);
        break;
      case 'none':
      default:
        // Keep original order
        break;
    }

    return result;
  }, [users, searchQuery, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / pageSize));
  // Keep a valid page when deleting the final user on the last page.
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * pageSize;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleRefresh = () => {
    void fetchUsers(true);
    setSearchQuery(''); // Clear search on refresh
    setSortOption('none'); // Reset sort on refresh
    setCurrentPage(1);
  };

  const handleViewDetails = async (userId: string) => {
    setShowModal(true);
    await fetchUserById(userId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    clearSelectedUser();
  };

  const getUserName = (userId: string) => {
    const userToDelete = users.find(u => u._id === userId);
    return userToDelete?.name || 'this user';
  };

  const handleSoftDeleteUser = async (userId: string) => {
    const userName = getUserName(userId);
    if (!window.confirm(`Soft-delete ${userName}? The user will be removed from the active users list.`)) return;

    try {
      if (await softDeleteUser(userId)) alert(`${userName} was soft-deleted.`);
    } catch (requestError) {
      alert(`Unable to soft-delete ${userName}: ${requestError}`);
    }
  };

  const handlePermanentlyDeleteUser = async (userId: string) => {
    const userName = getUserName(userId);
    if (!window.confirm(`Permanently delete ${userName}? This cannot be undone.`)) return;

    try {
      if (await permanentlyDeleteUser(userId)) alert(`${userName} was permanently deleted.`);
    } catch (requestError) {
      alert(`Unable to permanently delete ${userName}: ${requestError}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-vibrant">Users Management</h1>
            <p className="text-sm text-secondary mt-1 font-medium">
              Manage all registered users - Total: <span className="text-pink font-bold">{users.length}</span>
              {(searchQuery || sortOption !== 'none') && (
                <span className="ml-2">
                  | Showing: <span className="text-lime-dark font-bold">{filteredAndSortedUsers.length}</span>
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 lime-gradient disabled:opacity-60 text-white rounded-xl transition-all shadow-lime hover:shadow-lime-lg transform hover:scale-105 font-semibold"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {(error || deletionError) && (
          <div className="p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-800 dark:text-red-300">Error</p>
                <p className="text-sm text-red-700 dark:text-red-300">{error || deletionError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="flex flex-row items-start gap-4">
          {/* Sort Dropdown */}
          <div className="w-2/5 min-w-0 bg-surface p-4 rounded-xl border-2 border-pink/20 shadow-pink">
            <div className="flex items-center gap-3">
              <label htmlFor="sort-select" className="shrink-0 whitespace-nowrap text-sm font-bold text-foreground flex items-center gap-2">
                <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort By:
              </label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="min-w-0 flex-1 px-4 py-3 border-2 border-pink/30 rounded-xl bg-canvas text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-pink focus:border-pink transition-all cursor-pointer"
              >
                <option value="none">Default Order</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="verified">Verified Users Only</option>
                <option value="not-verified">Not Verified Users Only</option>
              </select>
              {sortOption !== 'none' && (
                <button
                  onClick={() => handleSortChange('none')}
                  className="shrink-0 px-4 py-3 bg-muted hover:bg-hover text-foreground rounded-xl transition-all font-semibold flex items-center gap-2 border-2 border-border-strong"
                  title="Clear sort"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>
            {sortOption !== 'none' && (
              <p className="mt-2 text-sm text-secondary flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-pink/20 text-pink-dark dark:text-pink-light font-bold text-xs">
                  {sortOption === 'name-asc' && '↑ A-Z'}
                  {sortOption === 'name-desc' && '↓ Z-A'}
                  {sortOption === 'verified' && '✓ Verified'}
                  {sortOption === 'not-verified' && '✗ Not Verified'}
                </span>
                <span>
                  Showing <span className="font-bold text-pink-dark dark:text-pink-light">{filteredAndSortedUsers.length}</span> user{filteredAndSortedUsers.length !== 1 ? 's' : ''}
                </span>
              </p>
            )}
          </div>

          {/* Search Bar */}
          <div className="min-w-0 flex-1 bg-surface p-4 rounded-xl border-2 border-lime/20 shadow-vibrant">
            <div className="flex gap-3">
              <div className="relative min-w-0 flex-1">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full px-4 py-3 pl-12 border-2 border-lime/30 rounded-xl bg-canvas text-foreground placeholder-subtle focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all font-medium"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-subtle"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-subtle hover:text-secondary transition-colors"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                disabled={!searchQuery.trim()}
                className="px-6 py-3 pink-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-pink hover:shadow-pink-lg transform hover:scale-105 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-secondary">
                Found <span className="font-bold text-lime-dark">{filteredAndSortedUsers.length}</span> user{filteredAndSortedUsers.length !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-surface rounded-2xl shadow-vibrant-lg border-2 border-lime/20 overflow-hidden">
          <UserTable
            users={paginatedUsers}
            startIndex={startIndex}
            onViewDetails={handleViewDetails}
            onSoftDeleteUser={handleSoftDeleteUser}
            onPermanentlyDeleteUser={handlePermanentlyDeleteUser}
            loading={loading}
            deletingUserId={deletingUserId}
          />
          {!loading && (
            <Pagination
              currentPage={activePage}
              pageSize={pageSize}
              totalItems={filteredAndSortedUsers.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && (
        <UserDetailsModal
          user={selectedUser}
          loading={detailsLoading}
          error={detailsError}
          onClose={handleCloseModal}
        />
      )}
    </DashboardLayout>
  );
}
