'use client';

import { User } from '@/types/user.types';

interface UserTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
  onSoftDeleteUser: (userId: string) => void;
  onPermanentlyDeleteUser: (userId: string) => void;
  loading?: boolean;
  deletingUserId?: string | null;
  startIndex?: number;
}

export default function UserTable({
  users,
  onViewDetails,
  onSoftDeleteUser,
  onPermanentlyDeleteUser,
  loading = false,
  deletingUserId = null,
  startIndex = 0,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-lime border-t-transparent"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary font-medium">No users found</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerificationBadge = (verified: boolean) => {
    if (verified) {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-800">
          Verified
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-muted text-foreground border border-border-strong">
        Not Verified
      </span>
    );
  };

  const getAdminBadge = (isAdmin: boolean) => {
    if (isAdmin) {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-pink/20 text-pink-dark dark:text-pink-light border border-pink/40">
          Admin
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-lime/20 text-lime-dark border border-lime/40">
          User
        </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-lime/20">
      <table className="min-w-full divide-y-2 divide-lime/20">
        <thead className="bg-gradient-to-r from-canvas to-surface">
          <tr>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Auth Method
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Email Verified
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-foreground uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-surface divide-y divide-border">
          {users.map((user, index) => (
            <tr key={user._id} className="hover:bg-canvas transition-all">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-bold text-gradient-vibrant">
                  {startIndex + index + 1}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-semibold text-foreground">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-secondary">{user.email}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-foreground capitalize font-medium">
                  {user.lastLoginMethod.replace('_', ' ')}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {getVerificationBadge(user.isEmailVerified)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                {getAdminBadge(user.admin)}
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-secondary">
                  {formatDate(user.createdAt)}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(user._id)}
                    className="text-pink hover:text-pink-dark font-bold transition-all px-4 py-2 rounded-lg hover:bg-pink/10 border border-pink/30 hover:border-pink"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSoftDeleteUser(user._id)}
                    disabled={deletingUserId !== null}
                    className="text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-300 disabled:opacity-50 font-bold transition-all px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/40 border border-orange-300 dark:border-orange-800 hover:border-orange-600 dark:hover:border-orange-800"
                    title="Soft delete user"
                  >
                    {deletingUserId === user._id ? 'Deleting…' : 'Soft delete'}
                  </button>
                  <button
                    onClick={() => onPermanentlyDeleteUser(user._id)}
                    disabled={deletingUserId !== null}
                    className="text-red-600 dark:text-red-300 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50 font-bold transition-all px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-300 dark:border-red-800 hover:border-red-600 dark:hover:border-red-800"
                    title="Permanently delete user"
                  >
                    Permanent delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
