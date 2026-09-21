import { apiClient } from './apiClient';
import { Initiative, CreateInitiativeDto, UpdateInitiativeDto } from '../models/initiative.model';

export class InitiativesController {
  static async getAll(params?: { communeId?: string; status?: string }): Promise<Initiative[]> {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.communeId) searchParams.set('communeId', params.communeId);
      if (params.status) searchParams.set('status', params.status);
      const str = searchParams.toString();
      if (str) query = `?${str}`;
    }
    return apiClient.get<Initiative[]>(`/initiatives${query}`);
  }

  static async getAllAdmin(params?: { communeId?: string }): Promise<Initiative[]> {
    let query = '';
    if (params?.communeId) query = `?communeId=${encodeURIComponent(params.communeId)}`;
    return apiClient.get<Initiative[]>(`/initiatives/admin/list${query}`);
  }

  static async getById(id: string): Promise<Initiative> {
    return apiClient.get<Initiative>(`/initiatives/${id}`);
  }

  static async create(data: CreateInitiativeDto): Promise<Initiative> {
    return apiClient.post<Initiative>('/initiatives', data);
  }

  static async update(id: string, data: UpdateInitiativeDto): Promise<Initiative> {
    return apiClient.patch<Initiative>(`/initiatives/${id}`, data);
  }

  static async setVisibility(id: string, isVisible: boolean): Promise<Initiative> {
    return apiClient.patch<Initiative>(`/initiatives/${id}/visibility`, { isVisible });
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/initiatives/${id}`);
  }
}
