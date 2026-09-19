import { apiClient } from './apiClient';
import { LoginCredentials, LoginResponse, AuthUser, ChangePasswordPayload } from '../models/auth.model';

export class AuthController {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (res?.accessToken) {
      apiClient.setToken(res.accessToken);
    }
    return res;
  }

  static async getMe(): Promise<AuthUser> {
    return apiClient.get<AuthUser>('/auth/me');
  }

  static logout(): void {
    apiClient.setToken(null);
  }

  static async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/change-password', payload);
  }

  static async resetPassword(userId: string, newPassword?: string): Promise<{ message: string; tempPassword?: string }> {
    return apiClient.post<{ message: string; tempPassword?: string }>(`/auth/reset-password/${userId}`, { newPassword });
  }
}
