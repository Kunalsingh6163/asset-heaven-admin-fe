import { User, CreateUserPayload, UpdateUserPayload } from '@/types/user.types';
import { API_CONFIG, HTTP_METHODS, getErrorMessage } from './config';

class UserService {
  /**
   * Fetch all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: HTTP_METHODS.GET,
        headers: API_CONFIG.HEADERS,
        cache: API_CONFIG.CACHE_POLICY,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Fetch user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        method: HTTP_METHODS.GET,
        headers: API_CONFIG.HEADERS,
        cache: API_CONFIG.CACHE_POLICY,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user (if API supports it)
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: HTTP_METHODS.POST,
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user (if API supports it)
   */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        method: HTTP_METHODS.PUT,
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user (if API supports it)
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        method: HTTP_METHODS.DELETE,
        headers: API_CONFIG.HEADERS,
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
