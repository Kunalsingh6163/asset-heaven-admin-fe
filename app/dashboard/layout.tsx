'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api/authService';
import { getSession, SESSION_CHANGED } from '@/services/api/session';
import { useAppDispatch } from '@/lib/hooks';
import { resetUsers } from '@/features/users/usersSlice';

export default function ProtectedDashboard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const signOut = () => {
      if (getSession()) return;
      setStatus('checking');
      dispatch(resetUsers());
      router.replace('/login');
    };
    window.addEventListener(SESSION_CHANGED, signOut);
    if (!getSession()) signOut();
    else authService.getCurrentAdmin().then(() => {
      if (active && getSession()) setStatus('ready');
    }).catch((failure: unknown) => {
      if (!active) return;
      if (!getSession()) signOut();
      else {
        setError(failure instanceof Error ? failure.message : 'Unable to verify your session.');
        setStatus('error');
      }
    });
    return () => {
      active = false;
      window.removeEventListener(SESSION_CHANGED, signOut);
    };
  }, [router, dispatch, attempt]);

  if (status === 'ready') return children;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-gray-800">
      <p role={status === 'error' ? 'alert' : 'status'}>{status === 'error' ? error : 'Checking admin session…'}</p>
      {status === 'error' && <button className="rounded-xl bg-white border px-4 py-2" onClick={() => {
        setStatus('checking');
        setAttempt((value) => value + 1);
      }}>Retry</button>}
    </div>
  );
}
