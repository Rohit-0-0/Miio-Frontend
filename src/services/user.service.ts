import { apiClient as api } from '@/lib/api/client';
import { User } from '@/types/auth';

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListUsersResponse {
  success: boolean;
  data: User[];
  pagination: Pagination;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export const userService = {
  getUsers: (params?: ListUsersParams) => {
    return api.get<ListUsersResponse>('/users', { params });
  },

  getUser: (id: string) => {
    return api.get<{ success: boolean; data: User }>(`/users/${id}`);
  },

  getMe: () => {
    return api.get<{ success: boolean; data: User }>('/users/me');
  },

  createUser: (data: Partial<User>) => {
    return api.post<{ success: boolean; data: User }>('/users', data);
  },

  updateUser: (id: string, data: Partial<User>) => {
    return api.patch<{ success: boolean; data: User }>(`/users/${id}`, data);
  },

  updateUserRole: (id: string, role: string) => {
    return api.patch<{ success: boolean; data: User }>(`/users/${id}/role`, { role });
  },

  updateUserStatus: (id: string, isActive: boolean) => {
    return api.patch<{ success: boolean; data: User }>(`/users/${id}/status`, { isActive });
  },

  deleteUser: (id: string) => {
    return api.delete<{ success: boolean }>(`/users/${id}`);
  },

  updateProfile: (data: { displayName?: string; avatarUrl?: string }) => {
    return api.patch<{ success: boolean; data: User }>('/users/profile', data);
  },

  updatePassword: (data: Record<string, string>) => {
    return api.patch<{ success: boolean }>('/users/password', data);
  }
};
