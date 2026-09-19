import { apiClient } from './apiClient';
import { Commune, UpdateCommuneDto } from '../models/commune.model';

export class CommunesController {
  static async getAll(): Promise<Commune[]> {
    return apiClient.get<Commune[]>('/communes');
  }

  static async getById(id: string): Promise<Commune> {
    return apiClient.get<Commune>(`/communes/${id}`);
  }

  static async update(id: string, data: UpdateCommuneDto): Promise<Commune> {
    return apiClient.patch<Commune>(`/communes/${id}`, data);
  }
}
