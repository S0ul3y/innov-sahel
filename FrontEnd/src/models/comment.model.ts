export interface Comment {
  id: string;
  publicationId?: string;
  initiativeId?: string;
  authorName: string;
  authorRole: 'citoyen' | 'porteur' | 'admin';
  message: string;
  date?: string;
  reported: boolean;
  parentCommentId?: string;
  replyText?: string;
  replyAuthorName?: string;
  replyDate?: string;
  createdAt?: string;
}

export interface CreateCommentDto {
  publicationId?: string;
  initiativeId?: string;
  authorName: string;
  authorRole?: 'citoyen' | 'porteur' | 'admin';
  message: string;
  parentCommentId?: string;
}
