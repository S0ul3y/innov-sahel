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
  gpsCoordinates?: { lat: number; lng: number } | null;
  citizenName?: string;
  citizenPhone?: string;
  internalStatus: ContributionStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContributionDto {
  type: ContributionType;
  communeId: string;
  category: string;
  description: string;
  photoUrl?: string;
  locationText?: string;
  gpsCoordinates?: { lat: number; lng: number } | null;
  citizenName?: string;
  citizenPhone?: string;
}

export interface UpdateContributionStatusDto {
  status: ContributionStatus;
  notes?: string;
}
