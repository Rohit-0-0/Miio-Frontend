import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { LoginResponse, User } from '@/types/auth';

export interface LoginInput {
  email: string;
  password?: string; // wait, password is required
}

class AuthService {
  private readonly basePath = '/auth';

  async login(data: { email: string; password?: string }): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<ApiResponse<LoginResponse>>(`${this.basePath}/login`, data);
  }

  async logout(): Promise<ApiResponse<null>> {
    return apiClient.post<ApiResponse<null>>(`${this.basePath}/logout`, {});
  }

  async getMe(): Promise<ApiResponse<User>> {
    return apiClient.get<ApiResponse<User>>(`${this.basePath}/me`);
  }
}

export const authService = new AuthService();
