import { apiClient } from './apiClient';
import { DashboardStats } from '../models/dashboard.model';

export class DashboardController {
  static async getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/dashboard/stats');
  }
}
