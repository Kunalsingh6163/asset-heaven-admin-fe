/**
 * Application Constants
 * Centralized constants used throughout the application
 */

/**
 * Application metadata
 */
export const APP_CONFIG = {
  NAME: 'Asset Heaven Admin',
  DESCRIPTION: 'Asset Heaven administration portal',
  VERSION: '1.0.0',
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  SETTINGS: '/settings',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'theme',
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

/**
 * UI Constants
 */
export const UI = {
  LOADING_DELAY: 300, // ms
  TOAST_DURATION: 3000, // ms
  MODAL_TRANSITION: 200, // ms
} as const;

/**
 * Date formats
 */
export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy HH:mm:ss',
  DATE_ONLY: 'MMMM dd, yyyy',
  TIME_ONLY: 'HH:mm:ss',
  SHORT: 'MM/dd/yyyy',
} as const;
