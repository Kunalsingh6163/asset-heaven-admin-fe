'use client';

import { useEffect, useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { authService, type AdminUser } from '@/services/api/authService';

export default function ProfilePage() {
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    authService.getCurrentAdmin().then((admin) => {
      if (active) setProfile(admin);
    }).catch((failure: unknown) => {
      if (active) setError(failure instanceof Error ? failure.message : 'Unable to load your profile.');
    });
    return () => { active = false; };
  }, [attempt]);

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gradient-vibrant">Profile</h1>
          <p className="mt-1 text-sm text-secondary">Your administrator account details.</p>
        </div>
        <section aria-label="Administrator profile" className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <UserCircleIcon className="mb-6 h-16 w-16 text-pink" />
          {error ? (
            <div className="space-y-4">
              <p role="alert" className="text-red-600 dark:text-red-300">{error}</p>
              <button type="button" onClick={() => { setError(''); setAttempt((value) => value + 1); }} className="rounded-lg border border-border-strong px-4 py-2 text-foreground hover:bg-muted">Retry</button>
            </div>
          ) : profile ? (
            <dl className="space-y-5">
              <div><dt className="text-sm text-secondary">Name</dt><dd className="mt-1 font-semibold text-foreground">{profile.name || 'Not provided'}</dd></div>
              <div><dt className="text-sm text-secondary">Email</dt><dd className="mt-1 break-words font-semibold text-foreground">{profile.email || 'Not provided'}</dd></div>
              <div><dt className="text-sm text-secondary">Role</dt><dd className="mt-1 font-semibold text-foreground">Administrator</dd></div>
            </dl>
          ) : <p role="status" className="text-secondary">Loading your profile…</p>}
        </section>
      </div>
    </DashboardLayout>
  );
}
