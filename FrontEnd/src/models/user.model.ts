import { AdminLevel } from './auth.model';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'porteur';
  adminLevel?: AdminLevel | null;
  communeId?: string;
  initiativeName?: string;
  status: 'actif' | 'suspendu';
  mustChangePassword?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  communeId?: string;
  initiativeName?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  communeId?: string;
  initiativeName?: string;
}
