'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_CREDENTIALS = {
  email: 'admin@gmail.com',
  password: 'Admin@123',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Store auth state in sessionStorage
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-lime/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 vibrant-gradient rounded-2xl flex items-center justify-center shadow-vibrant-lg transform hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-3xl">AH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-vibrant mb-2">
            Asset Heaven
          </h1>
          <h2 className="text-2xl font-bold text-gray-800">
            Admin Portal
          </h2>
          <p className="mt-3 text-gray-600 font-medium">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-vibrant-lg border-2 border-lime/20" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all text-sm font-medium"
                placeholder="admin@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all text-sm font-medium"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border-2 border-red-300">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-sm font-bold rounded-xl text-white vibrant-gradient hover:shadow-vibrant-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-vibrant"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-pink/50 to-transparent"></div>
              <span className="text-xs text-gray-600 font-medium uppercase">Demo Access</span>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-lime/50 to-transparent"></div>
            </div>
            <p className="text-xs text-gray-700 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <span className="text-pink font-bold">Email:</span> admin@gmail.com<br />
              <span className="text-lime-dark font-bold">Password:</span> Admin@123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
