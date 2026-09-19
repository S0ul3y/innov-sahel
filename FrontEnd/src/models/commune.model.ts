export interface Commune {
  id: string; // 'c1' to 'c6'
  name: string; // 'Commune I'
  district: string; // 'District de Bamako'
  neighborhoods: string[]; // ['Korofina', 'Djelibougou', ...]
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
  updatedAt?: string;
}

export type UpdateCommuneDto = Partial<Omit<Commune, 'id'>>;
