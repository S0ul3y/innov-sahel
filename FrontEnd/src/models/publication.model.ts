export type PublicationType = 'commune_news' | 'initiative_update' | 'activity';
export type PublicationFormat = 'carousel' | 'video';
export type PublicationStatus = 'draft' | 'published';

export interface Publication {
  id: string;
  type: PublicationType;
  format: PublicationFormat;
  authorUserId?: string;
  authorName: string;
  authorRole: 'admin' | 'porteur';
  initiativeId?: string;
  communeId: string;
  title: string;
  metaDescription?: string;
  coverImage?: string;
  content: string;
  carouselImages?: Array<{ url: string; caption?: string }>;
  youtubeUrl?: string;
  youtubeId?: string;
  publicationStatus?: PublicationStatus;
  status?: 'draft' | 'published'; // pour compatibilité
  date?: string;
  viewsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePublicationDto {
  type: PublicationType;
  format?: PublicationFormat;
  communeId: string;
  initiativeId?: string;
  title: string;
  metaDescription?: string;
  coverImage?: string;
  content: string;
  carouselImages?: Array<{ url: string; caption?: string }>;
  youtubeUrl?: string;
  youtubeId?: string;
  publicationStatus?: PublicationStatus;
  date?: string;
}

export type UpdatePublicationDto = Partial<CreatePublicationDto>;
