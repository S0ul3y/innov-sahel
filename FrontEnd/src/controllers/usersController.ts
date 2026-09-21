import { apiClient } from './apiClient';
import { UserAccount, CreateUserDto, UpdateUserDto } from '../models/user.model';

export interface CreateAdminDto {
  name: string;
  email: string;
  phone?: string;
  temporaryPassword: string;
}

export class UsersController {
  // ─── Porteurs ──────────────────────────────────────────────────────────────
  static async getAll(): Promise<UserAccount[]> {
    return apiClient.get<UserAccount[]>('/users');
  }

  static async getById(id: string): Promise<UserAccount> {
    return apiClient.get<UserAccount>(`/users/${id}`);
  }

  static async create(data: CreateUserDto): Promise<UserAccount> {
    return apiClient.post<UserAccount>('/users', data);
  }

  static async update(id: string, data: UpdateUserDto): Promise<UserAccount> {
    return apiClient.patch<UserAccount>(`/users/${id}`, data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }

  // ─── Toggle statut (actif ↔ suspendu) ─────────────────────────────────────
  static async toggleStatus(id: string): Promise<UserAccount> {
    return apiClient.patch<UserAccount>(`/users/${id}/status`, {});
  }

  static async updateStatus(id: string, _status?: string): Promise<UserAccount> {
    return apiClient.patch<UserAccount>(`/users/${id}/status`, {});
  }

  // ─── Admins Platform [Super Admin seulement] ───────────────────────────────
  static async getAdmins(): Promise<UserAccount[]> {
    return apiClient.get<UserAccount[]>('/users/admins');
  }

  static async createAdmin(data: CreateAdminDto): Promise<UserAccount> {
    return apiClient.post<UserAccount>('/users/admin', data);
  }
}

