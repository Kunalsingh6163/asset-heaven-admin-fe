import { apiClient } from './apiClient';
import { clearClientStorage, clearSession, getSession, saveSession } from './session';
import { API_CONFIG } from './config';

export type AdminUser = {
  admin?: boolean;
  name?: string;
  email?: string;
};

type LoginData = {
  accessToken?: string;
  refreshToken?: string;
  user?: AdminUser;
};

type ApiResponse<T> = T & {
  success?: boolean;
  message?: string;
  data?: T;
};

const getData = <T>(response: ApiResponse<T>): T => response.data ?? response;

const getMessage = <T>(response: ApiResponse<T>, fallback: string): string => {
  if (response.success === false) throw new Error(response.message || fallback);
  return response.message || fallback;
};

const publicRequestConfig = { skipAuth: true } as const;

class AuthService {
  async login(email: string, password: string): Promise<void> {
    clearSession();

    const response = await apiClient.post<ApiResponse<LoginData>>(
      API_CONFIG.ENDPOINTS.ADMIN_LOGIN,
      { email: email.trim().toLowerCase(), password },
      publicRequestConfig,
    );
    const { accessToken, refreshToken, user } = getData(response.data);
    getMessage(response.data, 'Unable to sign in.');

    if (typeof accessToken !== 'string' || !accessToken || typeof refreshToken !== 'string' || !refreshToken) throw new Error('The login response did not include the required session tokens.');
    if (user?.admin !== true) throw new Error('This account does not have administrator access.');

    saveSession({ accessToken, refreshToken });
  }

  async getCurrentAdmin(): Promise<AdminUser> {
    const response = await apiClient.get<ApiResponse<AdminUser>>(API_CONFIG.ENDPOINTS.CURRENT_USER);
    const user = getData(response.data);
    if (user.admin !== true) {
      clearSession();
      throw new Error('This account does not have administrator access.');
    }
    return user;
  }

  async logout(): Promise<void> {
    const session = getSession();
    try {
      if (session) await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT, { refreshToken: session.refreshToken });
    } finally {
      clearClientStorage();
    }
  }

  async requestPasswordReset(email: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>(
      API_CONFIG.ENDPOINTS.ADMIN_FORGOT_PASSWORD,
      { email },
      publicRequestConfig,
    );

    return getMessage(response.data, 'If the account exists, an OTP has been sent.');
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>(
      API_CONFIG.ENDPOINTS.ADMIN_VERIFY_OTP,
      { email, otp },
      publicRequestConfig,
    );

    return getMessage(response.data, 'OTP verified. Set a new password.');
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<Record<string, never>>>(
      API_CONFIG.ENDPOINTS.ADMIN_RESET_PASSWORD,
      { email, otp, newPassword },
      publicRequestConfig,
    );

    return getMessage(response.data, 'Password reset successfully. You can now sign in.');
  }
}

export const authService = new AuthService();
