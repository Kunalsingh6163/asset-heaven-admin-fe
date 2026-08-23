'use client';

import { User } from '@/types/user.types';

interface UserTableProps {
  users: User[];
  onViewDetails: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  loading?: boolean;
}

export default function UserTable({ users, onViewDetails, onDeleteUser, loading = false }: UserTableProps) {
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
        <p className="text-gray-600 font-medium">No users found</p>
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
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-300">
          Verified
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700 border border-gray-300">
        Not Verified
      </span>
    );
  };

  const getAdminBadge = (isAdmin: boolean) => {
    if (isAdmin) {
      return (
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-pink/20 text-pink-dark border border-pink/40">
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
        <thead className="bg-gradient-to-r from-gray-50 to-white">
          <tr>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Auth Method
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Email Verified
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.map((user, index) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-all">
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-bold text-gradient-vibrant">
                  {index + 1}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-base font-semibold text-gray-900">
                  {user.name}
                </div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-600">{user.email}</div>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-900 capitalize font-medium">
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
                <div className="text-sm text-gray-600">
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
                    onClick={() => onDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-800 font-bold transition-all p-2 rounded-lg hover:bg-red-50 border border-red-300 hover:border-red-600"
                    title="Delete User"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
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
