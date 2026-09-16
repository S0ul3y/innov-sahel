export type UserRole = 'visitor' | 'porteur' | 'admin';

export type TabType = 
  | 'accueil' 
  | 'ma_commune' 
  | 'initiatives' 
  | 'actualites' 
  | 'mon_espace' 
  | 'a_propos'
  | 'connexion';

export interface Commune {
  id: string; // 'c1' to 'c6'
  name: string; // 'Commune I'
  district: string; // 'District de Bamako'
  neighborhoods: string[]; // ['Korofina', 'Djelibougou', 'Bankoni', ...]
  population: string;
  superficie: string;
  description: string;
  mayor: string;
  mayorTeam: string;
  townHallAddress: string;
  townHallPhone: string;
  townHallEmail: string;
  openingHours: string;
  services: string[];
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  whatsappChannelUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type InitiativeStatus = 'demarre' | 'en_cours' | 'termine';
export type OwnerType = 'jeune' | 'femme' | 'collectif';

export interface Initiative {
  id: string;
  title: string;
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
  createdAt: string;
  videoUrl?: string;
}

export type PublicationType = 'commune_news' | 'initiative_update' | 'activity';
export type PublicationFormat = 'carousel' | 'video';

export interface Publication {
  id: string;
  type: PublicationType;
  format: PublicationFormat;
  authorName: string;
  authorRole: 'admin' | 'porteur';
  initiativeId?: string;
  communeId: string;
  title: string;
  metaDescription: string;
  coverImage: string;
  content: string; // rich text or structured text
  carouselImages?: Array<{ url: string; caption?: string }>;
  youtubeUrl?: string;
  youtubeId?: string;
  status: 'draft' | 'published';
  date: string;
  viewsCount: number;
}

export interface Comment {
  id: string;
  publicationId?: string;
  initiativeId?: string;
  authorName: string;
  authorRole: 'citoyen' | 'porteur' | 'admin';
  message: string;
  date: string;
  reported: boolean;
  parentCommentId?: string;
  replyText?: string;
}

export type ContributionType = 'idee' | 'signalement';
export type ContributionStatus = 'nouveau' | 'vu' | 'transmis' | 'cloture';

export interface CitizenContribution {
  id: string;
  type: ContributionType;
  communeId: string;
  category: string;
  description: string;
  photoUrl?: string;
  locationText?: string;
  gpsCoordinates?: { lat: number; lng: number };
  citizenName?: string;
  citizenPhone?: string;
  internalStatus: ContributionStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'porteur';
  communeId?: string;
  initiativeName?: string;
  status: 'actif' | 'suspendu';
  lastLogin?: string;
}
