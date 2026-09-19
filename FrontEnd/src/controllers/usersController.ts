import { apiClient } from './apiClient';
import { UserAccount, CreateUserDto, UpdateUserDto } from '../models/user.model';

export class UsersController {
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

  static async updateStatus(id: string, status: 'actif' | 'suspendu'): Promise<UserAccount> {
    return apiClient.patch<UserAccount>(`/users/${id}/status`, { status });
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/users/${id}`);
  }
}
