export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  displayName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  lastLoginAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
