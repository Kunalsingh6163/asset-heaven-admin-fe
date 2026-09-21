import axios, { AxiosError } from 'axios';
import { clearSession, getSession, saveSession } from './session';
import { API_CONFIG, getErrorMessage } from './config';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Public authentication routes must never receive a stale session token. */
    skipAuth?: boolean;
    _authRetried?: boolean;
    _sessionRefreshToken?: string;
  }
}

type ApiErrorBody = {
  message?: unknown;
  error?: unknown;
};

const getResponseMessage = (error: AxiosError<ApiErrorBody>): string => {
  const body = error.response?.data;
  const message = body?.message ?? body?.error;

  if (typeof message === 'string' && message.trim()) return message;

  if (error.response?.status === 401) {
    return 'Your admin session is missing or has expired. Please sign in again.';
  }

  return error.response ? getErrorMessage(error.response.status) : 'Unable to reach the server. Please check your connection.';
};

/**
 * Shared HTTP client for backend requests. Authentication is attached only at
 * request time so the token is never embedded in the JavaScript bundle.
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: 30_000,
});

let refreshing: { token: string; promise: Promise<string> } | null = null;

export function refreshSession(): Promise<string> {
  const session = getSession();
  if (!session) return Promise.reject(new Error('Please sign in again.'));
  if (refreshing?.token === session.refreshToken) return refreshing.promise;

  const promise = (async () => {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REFRESH_TOKEN,
        { refreshToken: session.refreshToken }, { skipAuth: true });
      const tokens = response.data?.data;
      if (typeof tokens?.accessToken !== 'string' || !tokens.accessToken) {
        throw new Error('The server did not return an access token. Please sign in again.');
      }
      // A response started before logout must never restore a signed-out session.
      if (getSession()?.refreshToken !== session.refreshToken) throw new Error('Session changed. Please sign in again.');
      saveSession({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken || session.refreshToken });
      return tokens.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error) && [400, 401, 403].includes(error.response?.status ?? 0) &&
          getSession()?.refreshToken === session.refreshToken) clearSession();
      throw error;
    } finally {
      if (refreshing?.token === session.refreshToken) refreshing = null;
    }
  })();
  refreshing = { token: session.refreshToken, promise };
  return promise;
}

apiClient.interceptors.request.use((config) => {
  const session = getSession();
  if (config.skipAuth) {
    config.headers.delete('Authorization');
  } else {
    config._sessionRefreshToken = session?.refreshToken;
    if (session) config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    else config.headers.delete('Authorization');
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const config = error.config;
    if (error.response?.status === 401 && config && !config.skipAuth) {
      const session = getSession();
      // Do not retry an old account's request under a newer login.
      if (session && config._sessionRefreshToken === session.refreshToken && !config._authRetried) {
        config._authRetried = true;
        if (config.headers.get('Authorization') === `Bearer ${session.accessToken}`) await refreshSession();
        return apiClient.request(config);
      }
      if (!session || config._sessionRefreshToken === session.refreshToken) clearSession();
    }
    error.message = getResponseMessage(error);
    return Promise.reject(error);
  },
);
