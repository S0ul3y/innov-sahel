import { apiClient } from './apiClient';

export interface UploadResult {
  id?: string;
  url: string;
  thumbnailUrl?: string | null;
  originalName?: string;
  size?: number;
  width?: number;
  height?: number;
}

export const UploadsController = {
  /**
   * Téléverse une image unique (utilise le système centralisé Sharp/WebP).
   * Si l'utilisateur est authentifié, utilise /api/media/upload ou /api/uploads/image.
   * Si non authentifié, utilise /api/media/upload-public.
   */
  uploadImage: async (file: File, role: string = 'cover'): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('innovsahel_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    
    const endpoint = token 
      ? `${baseUrl}/media/upload?role=${role}` 
      : `${baseUrl}/media/upload-public`;

    const res = await fetch(endpoint, {
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
   * Téléverse une image sans authentification (contributions citoyennes: idées, signalements).
   */
  uploadPublicImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${baseUrl}/media/upload-public`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors du téléversement de la photo.');
    }
    return res.json();
  },

  /**
   * Téléverse plusieurs images (carrousel).
   * @returns tableau de UploadResult
   */
  uploadImages: async (files: File[], role: string = 'gallery'): Promise<UploadResult[]> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const token = localStorage.getItem('innovsahel_token');
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${baseUrl}/media/upload-multiple?role=${role}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors du téléversement des images.');
    }
    return res.json();
  },

  /**
   * Supprimer un média de la plateforme [ADMIN].
   */
  deleteMedia: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/media/${id}`);
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
