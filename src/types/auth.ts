export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
