'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRightStartOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { authService } from '@/services/api/authService';

export default function AdminMenu() {
  const router = useRouter();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const logoutPending = useRef(false);

  useEffect(() => {
    if (!open) return;
    containerRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const handleLogout = async () => {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // Logout always clears browser storage, even if token revocation fails.
    } finally {
      router.replace('/login');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-3 pl-3 border-l border-border"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        const items = Array.from(containerRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
        const current = items.indexOf(document.activeElement as HTMLElement);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
          : (current + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
        items[next]?.focus();
      }}
    >
      <div className="hidden sm:block text-right">
        <p className="text-sm font-semibold text-foreground">Admin User</p>
        <p className="text-xs text-secondary uppercase tracking-wide">Administrator</p>
      </div>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Admin account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className="rounded-xl p-1 text-secondary hover:text-pink hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
      >
        <UserCircleIcon className="h-8 w-8" />
      </button>
      {open && (
        <div id={menuId} role="menu" aria-label="Admin account" className="absolute right-0 top-full z-50 mt-3 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
          <Link
            href="/dashboard/profile"
            role="menuitem"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted focus:bg-muted focus:outline-none"
          >
            <UserCircleIcon className="h-5 w-5" />
            Profile
          </Link>
          <button
            type="button"
            role="menuitem"
            tabIndex={-1}
            disabled={loggingOut}
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 dark:text-red-300 hover:bg-muted focus:bg-muted focus:outline-none disabled:opacity-50"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            {loggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}
