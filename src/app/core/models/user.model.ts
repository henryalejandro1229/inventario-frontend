export type UserRole = 'ADMIN' | 'USER';

export interface User {
  username: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: UserRole;
}
