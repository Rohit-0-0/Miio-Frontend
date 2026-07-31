import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/types/api';
import { LoginResponse, User } from '@/types/auth';

export interface LoginInput {
  email: string;
  password?: string; // wait, password is required
}

class AuthService {
  private readonly basePath = '/auth';

  async register(data: { email: string; password?: string; displayName: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`${this.basePath}/register`, data);
  }

  async verifyEmail(data: { email: string; otp: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`${this.basePath}/verify-email`, data);
  }

  async resendVerificationOtp(data: { email: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`${this.basePath}/resend-verification-otp`, data);
  }

  async forgotPassword(data: { email: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`${this.basePath}/forgot-password`, data);
  }

  async resetPassword(data: { email: string; otp: string; password?: string }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<ApiResponse<{ message: string }>>(`${this.basePath}/reset-password`, data);
  }

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
