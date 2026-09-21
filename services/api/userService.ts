import { User } from '@/types/user.types';
import { apiClient } from './apiClient';
import { API_CONFIG } from './config';

type ApiEnvelope<T> = {
  data?: T;
};

const unwrapData = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

class UserService {
  /**
   * Fetch all users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[] | ApiEnvelope<User[]>>(API_CONFIG.ENDPOINTS.USERS);
    const users = unwrapData(response.data);

    if (!Array.isArray(users)) throw new Error('The users endpoint returned an unexpected response.');

    // Older accounts may have no name or auth-method metadata in MongoDB.
    return users.map(normalizeUser);
  }

  /**
   * Fetch user by ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User | ApiEnvelope<User>>(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
    return normalizeUser(unwrapData(response.data));
  }

  /** Soft-deletes a user. */
  async softDeleteUser(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.SOFT_DELETE_USER(id));
  }

  /** Permanently removes a user and all recoverable data is lost. */
  async permanentlyDeleteUser(id: string): Promise<void> {
    await apiClient.delete(API_CONFIG.ENDPOINTS.PERMANENT_DELETE_USER(id));
  }
}

export const userService = new UserService();

function normalizeUser(user: User): User {
  return {
    ...user,
    name: user.name || '',
    authMethods: Array.isArray(user.authMethods) ? user.authMethods : [],
    lastLoginMethod: user.lastLoginMethod || '',
  };
}
