'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api/authService';

type AuthView = 'login' | 'forgot-password' | 'verify-otp' | 'reset-password';

const inputClassName = 'appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 placeholder-gray-400 text-gray-900 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime focus:border-lime transition-all text-sm font-medium';

const viewContent: Record<AuthView, { title: string; description: string; submitLabel: string }> = {
  login: { title: 'Admin Portal', description: 'Sign in to access the admin dashboard', submitLabel: 'Sign in' },
  'forgot-password': { title: 'Forgot password', description: 'Enter your administrator email and we will send an OTP.', submitLabel: 'Send OTP' },
  'verify-otp': { title: 'Verify OTP', description: 'Enter the one-time password sent to your email.', submitLabel: 'Verify OTP' },
  'reset-password': { title: 'Set a new password', description: 'Choose a new password for your administrator account.', submitLabel: 'Reset password' },
};

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const changeView = (nextView: AuthView) => {
    setView(nextView);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      if (view === 'login') {
        await authService.login(email, password);
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/dashboard');
        return;
      }

      if (view === 'forgot-password') {
        const message = await authService.requestPasswordReset(email);
        setNotice(message);
        setView('verify-otp');
        return;
      }

      if (view === 'verify-otp') {
        const message = await authService.verifyPasswordResetOtp(email, otp);
        setNotice(message);
        setView('reset-password');
        return;
      }

      if (newPassword !== confirmPassword) throw new Error('The new passwords do not match.');

      const message = await authService.resetPassword(email, otp, newPassword);
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setNotice(message);
      setView('login');
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Unable to complete this request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const content = viewContent[view];
  const isLogin = view === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-lime/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink/20 to-transparent rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 vibrant-gradient rounded-2xl flex items-center justify-center shadow-vibrant-lg">
              <span className="text-white font-bold text-3xl">AH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-vibrant mb-2">Asset Heaven</h1>
          <h2 className="text-2xl font-bold text-gray-800">{content.title}</h2>
          <p className="mt-3 text-gray-600 font-medium">{content.description}</p>
        </div>

        <form className="mt-8 space-y-5 bg-white p-8 rounded-2xl shadow-vibrant-lg border-2 border-lime/20" onSubmit={handleSubmit}>
          {(isLogin || view === 'forgot-password') && (
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClassName} placeholder="Enter your admin email" />
            </div>
          )}

          {isLogin && (
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClassName} placeholder="Enter your password" />
            </div>
          )}

          {view === 'verify-otp' && (
            <div>
              <label htmlFor="otp" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">One-time password</label>
              <input id="otp" name="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} className={inputClassName} placeholder="Enter 6-digit OTP" />
            </div>
          )}

          {view === 'reset-password' && (
            <>
              <div>
                <label htmlFor="new-password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">New password</label>
                <input id="new-password" name="new-password" type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className={inputClassName} placeholder="Enter a new password" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Confirm new password</label>
                <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClassName} placeholder="Re-enter the new password" />
              </div>
            </>
          )}

          {error && <p role="alert" className="rounded-xl bg-red-50 p-4 border-2 border-red-300 text-sm font-semibold text-red-800">{error}</p>}
          {notice && <p aria-live="polite" className="rounded-xl bg-green-50 p-4 border-2 border-green-300 text-sm font-semibold text-green-800">{notice}</p>}

          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border-2 border-transparent text-sm font-bold rounded-xl text-white vibrant-gradient hover:shadow-vibrant-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-vibrant">
            {loading ? 'Please wait…' : content.submitLabel}
          </button>

          {isLogin && <button type="button" onClick={() => changeView('forgot-password')} className="w-full text-sm font-bold text-pink hover:text-pink-dark transition-colors">Forgot password?</button>}
          {!isLogin && <button type="button" onClick={() => changeView('login')} className="w-full text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Back to sign in</button>}
        </form>
      </div>
    </div>
  );
}
