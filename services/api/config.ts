/**
 * API Configuration
 * Centralized API configuration for the application
 * 
 * The API base URL is read from environment variables:
 * - NEXT_PUBLIC_API_URL: Set this in .env.local for your environment
 * - Defaults to production URL if not set
 * 
 * To switch between localhost and deployed API:
 * 1. Copy .env.example to .env.local
 * 2. Update NEXT_PUBLIC_API_URL in .env.local
 * 3. Restart the dev server
 */

// Get API URL from environment variable or use production as fallback
const getApiBaseUrl = (): string => {
  // Check if we're in browser or server
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    console.log('🌐 Using API URL from environment:', envUrl);
    return envUrl;
  }
  
  // Fallback to production URL
  const fallbackUrl = 'https://mobulous-tech.vercel.app/api';
  console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using fallback:', fallbackUrl);
  return fallbackUrl;
};

export const API_CONFIG = {
  // Dynamic base URL from environment
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    ADMIN_LOGIN: '/admin/login',
    ADMIN_FORGOT_PASSWORD: '/admin/forgot-password',
    ADMIN_VERIFY_OTP: '/admin/verify-otp',
    ADMIN_RESET_PASSWORD: '/admin/reset-password',
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    SOFT_DELETE_USER: (id: string) => `/admin/users/${id}`,
    PERMANENT_DELETE_USER: (id: string) => `/admin/users/${id}/permanent`,
  },
  HEADERS: {
    'Content-Type': 'application/json',
  },
  CACHE_POLICY: 'no-store' as RequestCache,
} as const;

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

/**
 * API Error Messages
 */
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access. Please login.',
  FORBIDDEN: 'Access forbidden.',
  UNKNOWN: 'An unknown error occurred.',
} as const;

/**
 * Get error message based on status code
 */
export function getErrorMessage(statusCode: number): string {
  switch (statusCode) {
    case 401:
      return API_ERRORS.UNAUTHORIZED;
    case 403:
      return API_ERRORS.FORBIDDEN;
    case 404:
      return API_ERRORS.NOT_FOUND;
    case 500:
    case 502:
    case 503:
      return API_ERRORS.SERVER_ERROR;
    default:
      return API_ERRORS.UNKNOWN;
  }
}
