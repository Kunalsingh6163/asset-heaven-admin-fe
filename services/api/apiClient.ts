import axios, { AxiosError } from 'axios';
import { STORAGE_KEYS } from '@/constants/app.constants';
import { API_CONFIG, getErrorMessage } from './config';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Public authentication routes must never receive a stale session token. */
    skipAuth?: boolean;
  }
}

type ApiErrorBody = {
  message?: unknown;
  error?: unknown;
};

const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  return window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const setAccessToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }
};

export const clearAccessToken = (): void => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
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

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (!config.skipAuth && token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => Promise.reject(new Error(getResponseMessage(error))),
);
