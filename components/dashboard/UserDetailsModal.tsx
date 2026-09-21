'use client';

import { User } from '@/types/user.types';

interface UserDetailsModalProps {
  user: User | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
}

export default function UserDetailsModal({ user, loading = false, error = null, onClose }: UserDetailsModalProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-vibrant-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-lime/30">
        <div className="flex justify-between items-center p-6 border-b-2 border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gradient-vibrant">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-pink transition-all p-2 hover:bg-gray-100 rounded-xl"
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

        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-12 text-gray-600">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-lime border-t-transparent" />
              <span className="font-medium">Loading user details…</span>
            </div>
          )}

          {!loading && error && !user && (
            <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 text-red-800">
              <p className="font-bold">Unable to load user details</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {!loading && user && (
            <>
          {/* User ID */}
          <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-xl border border-gray-200">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
              User ID
            </label>
            <p className="mt-2 text-sm text-gray-900 font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
              {user._id}
            </p>
          </div>

          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-bold text-gradient-lime mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Name
                </label>
                <p className="mt-1 text-base text-gray-900 font-semibold">
                  {user.name}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Email
                </label>
                <p className="mt-1 text-base text-gray-900 break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Information */}
          <div>
            <h3 className="text-lg font-bold text-gradient-pink mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Authentication
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Auth Methods
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.authMethods.map((method, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-bold rounded-full bg-lime/20 text-lime-dark border border-lime/40">
                      {method.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Last Login Method
                </label>
                <p className="mt-1 text-base text-gray-900 capitalize font-medium">
                  {user.lastLoginMethod.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div>
            <h3 className="text-lg font-bold text-gradient-vibrant mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Email Verified
                </label>
                <div className="mt-2">
                  {user.isEmailVerified ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 border border-green-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      Not Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  User Role
                </label>
                <div className="mt-2">
                  {user.admin ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-pink/20 text-pink-dark border border-pink/40">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-lime/20 text-lime-dark border border-lime/40">
                      User
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div>
            <h3 className="text-lg font-bold text-gradient-pink mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Timestamps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Last Updated
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
            </>
          )}
        </div>

        <div className="p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-transparent sticky bottom-0">
          <button
            onClick={onClose}
            className="w-full vibrant-gradient text-white font-bold py-3 px-4 rounded-xl transition-all shadow-vibrant hover:shadow-vibrant-lg transform hover:scale-[1.02]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
