import { apiClient, clearAccessToken, setAccessToken } from './apiClient';
import { API_CONFIG } from './config';

type AdminUser = {
  admin?: boolean;
};

type LoginData = {
  accessToken?: string;
  token?: string;
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
    clearAccessToken();

    const response = await apiClient.post<ApiResponse<LoginData>>(
      API_CONFIG.ENDPOINTS.ADMIN_LOGIN,
      { email, password },
      publicRequestConfig,
    );
    const { accessToken, token, user } = getData(response.data);
    getMessage(response.data, 'Unable to sign in.');

    if (!accessToken && !token) throw new Error('The login response did not include an access token.');
    if (user?.admin === false) throw new Error('This account does not have administrator access.');

    setAccessToken(accessToken ?? token ?? '');
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
