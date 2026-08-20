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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-cream/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-bronze/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 golden-gradient rounded-2xl flex items-center justify-center shadow-golden-lg transform hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-3xl">AH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-golden mb-2">
            Asset Heaven
          </h1>
          <h2 className="text-2xl font-bold text-bronze dark:text-bronze-light">
            Admin Portal
          </h2>
          <p className="mt-3 text-brass dark:text-brass-light font-medium">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-golden-lg border-2 border-gold/20 dark:border-brass/20" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-bronze dark:text-brass-light mb-2 uppercase tracking-wide">
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
                className="appearance-none relative block w-full px-4 py-3 border-2 border-brass/30 dark:border-brass/20 placeholder-brass/50 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-cream/30 dark:bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-sm font-medium"
                placeholder="admin@gmail.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-bronze dark:text-brass-light mb-2 uppercase tracking-wide">
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
                className="appearance-none relative block w-full px-4 py-3 border-2 border-brass/30 dark:border-brass/20 placeholder-brass/50 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 bg-cream/30 dark:bg-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all text-sm font-medium"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/30 p-4 border-2 border-red-300 dark:border-red-800">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-200">
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
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-sm font-bold rounded-xl text-white golden-gradient hover:shadow-golden-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-golden"
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
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
              <span className="text-xs text-brass dark:text-brass-light font-medium uppercase">Demo Access</span>
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
            </div>
            <p className="text-xs text-brass dark:text-brass-light font-medium bg-cream/50 dark:bg-gray-700/50 px-4 py-2 rounded-lg">
              <span className="text-bronze dark:text-bronze-light font-bold">Email:</span> admin@gmail.com<br />
              <span className="text-bronze dark:text-bronze-light font-bold">Password:</span> Admin@123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
