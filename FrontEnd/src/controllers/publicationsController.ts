import { apiClient } from './apiClient';
import { Publication, CreatePublicationDto, UpdatePublicationDto, PublicationStatus } from '../models/publication.model';

export class PublicationsController {
  static async getAll(params?: { type?: string; communeId?: string; format?: string }): Promise<Publication[]> {
    let query = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.type) searchParams.set('type', params.type);
      if (params.communeId) searchParams.set('communeId', params.communeId);
      if (params.format) searchParams.set('format', params.format);
      const str = searchParams.toString();
      if (str) query = `?${str}`;
    }
    return apiClient.get<Publication[]>(`/publications${query}`);
  }

  static async getAllAdmin(): Promise<Publication[]> {
    return apiClient.get<Publication[]>('/publications/admin/all');
  }

  static async getById(id: string): Promise<Publication> {
    return apiClient.get<Publication>(`/publications/${id}`);
  }

  static async create(data: CreatePublicationDto): Promise<Publication> {
    return apiClient.post<Publication>('/publications', data);
  }

  static async update(id: string, data: UpdatePublicationDto): Promise<Publication> {
    return apiClient.patch<Publication>(`/publications/${id}`, data);
  }

  static async setStatus(id: string, status: PublicationStatus): Promise<Publication> {
    return apiClient.patch<Publication>(`/publications/${id}/status`, { status });
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/publications/${id}`);
  }
}
