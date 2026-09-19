export type InitiativeStatus = 'demarre' | 'en_cours' | 'termine';
export type OwnerType = 'jeune' | 'femme' | 'collectif';

export interface Initiative {
  id: string;
  title: string;
  ownerUserId?: string;
  ownerName: string;
  ownerType: OwnerType;
  ownerBio: string;
  ownerAvatar?: string;
  communeId: string;
  domain: string;
  problem: string;
  solution: string;
  beneficiaries: string;
  startDate: string;
  status: InitiativeStatus;
  coverImage: string;
  gallery: Array<{ url: string; caption?: string }>;
  viewsCount: number;
  videoUrl?: string;
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInitiativeDto {
  title: string;
  ownerName: string;
  ownerType?: OwnerType;
  ownerBio?: string;
  ownerAvatar?: string;
  communeId: string;
  domain: string;
  problem: string;
  solution: string;
  beneficiaries?: string;
  startDate?: string;
  status?: InitiativeStatus;
  coverImage?: string;
  gallery?: Array<{ url: string; caption?: string }>;
  videoUrl?: string;
}

export type UpdateInitiativeDto = Partial<CreateInitiativeDto>;
