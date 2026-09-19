export type UserRole = 'visitor' | 'porteur' | 'admin';
export type AdminLevel = 'principal' | 'suivi';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'porteur';
  adminLevel?: AdminLevel | null;
  communeId?: string;
  initiativeName?: string;
  status: 'actif' | 'suspendu';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
