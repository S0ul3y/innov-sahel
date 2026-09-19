import { apiClient } from './apiClient';
import { Comment, CreateCommentDto } from '../models/comment.model';

export class CommentsController {
  static async getByPublication(publicationId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/publication/${publicationId}`);
  }

  static async getByInitiative(initiativeId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/initiative/${initiativeId}`);
  }

  static async getReported(): Promise<Comment[]> {
    return apiClient.get<Comment[]>('/comments/reported');
  }

  static async create(data: CreateCommentDto): Promise<Comment> {
    return apiClient.post<Comment>('/comments', data);
  }

  static async report(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/comments/${id}/report`);
  }

  static async reply(id: string, replyText: string): Promise<Comment> {
    return apiClient.post<Comment>(`/comments/${id}/reply`, { replyText });
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/comments/${id}`);
  }
}
