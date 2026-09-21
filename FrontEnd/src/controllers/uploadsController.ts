import { apiClient } from './apiClient';

export interface UploadResult {
  url: string;
  originalName: string;
  size: number;
}

export const UploadsController = {
  /**
   * Téléverse une image unique.
   * @returns { url: '/uploads/xxxx.jpg' }
   */
  uploadImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    // On utilise fetch directement car apiClient (axios) gère différemment le FormData
    const token = localStorage.getItem('innovsahel_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${baseUrl}/uploads/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors du téléversement.');
    }
    return res.json();
  },

  /**
   * Téléverse plusieurs images (carrousel).
   * @returns tableau de { url, originalName, size }
   */
  uploadImages: async (files: File[]): Promise<UploadResult[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const token = localStorage.getItem('innovsahel_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${baseUrl}/uploads/images`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors du téléversement.');
    }
    return res.json();
  },

  /**
   * Construit l'URL complète pour afficher une image uploadée.
   */
  getImageUrl: (path: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace('/api', '');
    return `${base}${path}`;
  },
};
