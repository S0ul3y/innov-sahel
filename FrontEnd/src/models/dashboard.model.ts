export interface DashboardStats {
  totals: {
    initiatives: number;
    publications: number;
    comments: number;
    contributions: number;
    users: number;
    porteurs: number;
  };
  contributionsByStatus: {
    nouveau: number;
    vu: number;
    transmis: number;
    cloture: number;
  };
  contributionsByType: {
    idee: number;
    signalement: number;
  };
  initiativesByStatus: {
    demarre: number;
    en_cours: number;
    termine: number;
  };
  communesStats?: Array<{
    communeId: string;
    communeName: string;
    initiativesCount: number;
    publicationsCount: number;
    contributionsCount: number;
  }>;
}
