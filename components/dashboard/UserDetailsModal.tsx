'use client';

import { User } from '@/types/user.types';

interface UserDetailsModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              User ID
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100 font-mono">
              {user._id}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Phone
            </label>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user.phone}</p>
          </div>

          {user.createdAt && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {new Date(user.createdAt).toLocaleString()}
              </p>
            </div>
          )}

          {user.updatedAt && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Updated At
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {new Date(user.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
