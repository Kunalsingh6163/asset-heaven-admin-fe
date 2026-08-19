/**
 * API Configuration
 * Centralized API configuration for the application
 */

export const API_CONFIG = {
  BASE_URL: 'https://mobulous-tech.vercel.app/api',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
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
