export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  displayName?: string;
  avatarUrl?: string;
  isActive?: boolean;
  lastLoginAt?: string | Date;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
