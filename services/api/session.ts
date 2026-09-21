import { API_CONFIG } from './config';

const SESSION_KEY = `admin_session:${API_CONFIG.BASE_URL}`;
export const SESSION_CHANGED = 'admin-session-changed';
export type AdminSession = { accessToken: string; refreshToken: string };

export function getSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || 'null');
    return typeof value?.accessToken === 'string' && value.accessToken &&
      typeof value?.refreshToken === 'string' && value.refreshToken ? value : null;
  } catch {
    return null;
  }
}

export function saveSession(session: AdminSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_CHANGED));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem('auth_token');
  window.sessionStorage.removeItem('isAdminAuthenticated');
  window.dispatchEvent(new Event(SESSION_CHANGED));
}

/** Explicit logout clears all storage belonging to this application origin. */
export function clearClientStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.clear();
  } catch {
    // Storage can be blocked by browser settings. Still clear the session.
  }
  try {
    window.sessionStorage.clear();
  } finally {
    window.dispatchEvent(new Event(SESSION_CHANGED));
  }
}
