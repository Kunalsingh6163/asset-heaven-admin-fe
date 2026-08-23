'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchUsers, fetchUserById, clearSelectedUser, deleteUser } from '@/features/users/usersSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import UserTable from '@/components/dashboard/UserTable';
import UserDetailsModal from '@/components/dashboard/UserDetailsModal';

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const { users, selectedUser, loading, error } = useAppSelector((state) => state.users);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleViewDetails = async (userId: string) => {
    await dispatch(fetchUserById(userId));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(clearSelectedUser());
  };

  const handleDeleteUser = async (userId: string) => {
    // Find the user to get their name for the confirmation message
    const userToDelete = users.find(u => u._id === userId);
    const userName = userToDelete?.name || 'this user';

    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        // Show success message
        alert(`User ${userName} has been deleted successfully.`);
      } catch (error) {
        // Error is already in the state, but we can show an alert too
        alert(`Failed to delete user: ${error}`);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-vibrant">Users Management</h1>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              Manage all registered users - Total: <span className="text-pink font-bold">{users.length}</span>
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
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-vibrant-lg border-2 border-lime/20 overflow-hidden">
          <UserTable
            users={users}
            onViewDetails={handleViewDetails}
            onDeleteUser={handleDeleteUser}
            loading={loading}
          />
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && (
        <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </DashboardLayout>
  );
}
