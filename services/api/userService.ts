import axios, { AxiosError } from 'axios';
import { User, CreateUserPayload, UpdateUserPayload } from '@/types/user.types';
import { API_CONFIG, HTTP_METHODS, getErrorMessage } from './config';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: 30000, // 30 seconds
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = getErrorMessage(error.response.status);
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error('Failed to make request. Please try again.');
    }
  }
);

class UserService {
  /**
   * Fetch all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.USERS}`;
      console.log('Fetching users from:', API_CONFIG.BASE_URL + url);
      
      const response = await apiClient.get(url);
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // The API returns { data: [...] }
      if (response.data && response.data.data) {
        console.log('Fetched users:', response.data.data.length);
        return response.data.data;
      }
      
      // If direct array
      if (Array.isArray(response.data)) {
        console.log('Fetched users:', response.data.length);
        return response.data;
      }
      
      throw new Error('Invalid response format from server');
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
      const url = `${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`;
      console.log('Fetching user from:', API_CONFIG.BASE_URL + url);
      
      const response = await apiClient.get(url);
      
      // Handle response format
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(payload: CreateUserPayload): Promise<User> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.USERS}`;
      
      const response = await apiClient.post(url, payload);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`;
      
      const response = await apiClient.put(url, payload);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      const url = `${API_CONFIG.ENDPOINTS.DELETE_USER(id)}`;
      console.log('Deleting user from:', API_CONFIG.BASE_URL + url);
      
      await apiClient.delete(url);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
