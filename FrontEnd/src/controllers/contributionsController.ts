import { apiClient } from './apiClient';
import { 
  CitizenContribution, 
  CreateContributionDto, 
  UpdateContributionStatusDto 
} from '../models/contribution.model';

export class ContributionsController {
  static async create(data: CreateContributionDto): Promise<CitizenContribution> {
    return apiClient.post<CitizenContribution>('/contributions', data);
  }

  static async getAll(params?: { communeId?: string; type?: string; status?: string }): Promise<CitizenContribution[]> {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.communeId) searchParams.set('communeId', params.communeId);
      if (params.type) searchParams.set('type', params.type);
      if (params.status) searchParams.set('status', params.status);
      const str = searchParams.toString();
      if (str) query = `?${str}`;
    }
    return apiClient.get<CitizenContribution[]>(`/contributions${query}`);
  }

  static async getById(id: string): Promise<CitizenContribution> {
    return apiClient.get<CitizenContribution>(`/contributions/${id}`);
  }

  static async updateStatus(id: string, payload: UpdateContributionStatusDto): Promise<CitizenContribution> {
    return apiClient.patch<CitizenContribution>(`/contributions/${id}/status`, payload);
  }

  static async exportCsv(communeId?: string): Promise<string> {
    const query = communeId ? `?communeId=${communeId}` : '';
    // Fetch raw CSV string
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const token = localStorage.getItem('innovsahel_token');
    const response = await fetch(`${API_BASE_URL}/contributions/export${query}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.text();
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/contributions/${id}`);
  }
}
