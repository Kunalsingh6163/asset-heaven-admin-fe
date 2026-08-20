'use client';

import { User } from '@/types/user.types';

interface UserTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
  loading?: boolean;
}

export default function UserTable({ users, onViewDetails, loading = false }: UserTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-brass dark:text-brass-light font-medium">No users found</p>
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
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700">
          Verified
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-brass/20 text-brass-dark dark:bg-brass/10 dark:text-brass-light border border-brass/40 dark:border-brass/30">
        Not Verified
      </span>
    );
  };

  const getAdminBadge = (isAdmin: boolean) => {
    if (isAdmin) {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-gold/20 text-gold-dark dark:bg-gold/10 dark:text-gold-light border border-gold/40 dark:border-gold/30">
          Admin
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
          User
        </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-gold/20 dark:border-brass/20">
      <table className="min-w-full divide-y-2 divide-gold/20 dark:divide-brass/20">
        <thead className="bg-gradient-to-r from-cream/50 to-white dark:from-gray-800 dark:to-gray-800/50">
          <tr>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Auth Method
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Email Verified
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-bronze dark:text-brass-light uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm divide-y divide-gold/10 dark:divide-brass/10">
          {users.map((user, index) => (
            <tr key={user._id} className="hover:bg-cream/40 dark:hover:bg-gray-800/60 transition-all">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-bold text-gold dark:text-gold-light">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-brass-dark dark:text-brass-light">{user.email}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-100 capitalize font-medium">
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
                <div className="text-sm text-brass-dark dark:text-brass-light">
                  {formatDate(user.createdAt)}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap text-sm">
                <button
                  onClick={() => onViewDetails(user._id)}
                  className="text-bronze hover:text-gold dark:text-brass-light dark:hover:text-gold font-bold transition-all px-4 py-2 rounded-lg hover:bg-cream/50 dark:hover:bg-gray-700/50 border border-bronze/30 dark:border-brass/30 hover:border-gold dark:hover:border-gold"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
