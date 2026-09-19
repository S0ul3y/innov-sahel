export * from './auth.model';
export * from './user.model';
export * from './commune.model';
export * from './initiative.model';
export * from './publication.model';
export * from './comment.model';
export * from './contribution.model';
export * from './dashboard.model';

export type TabType = 
  | 'accueil' 
  | 'ma_commune' 
  | 'initiatives' 
  | 'actualites' 
  | 'mon_espace' 
  | 'a_propos'
  | 'connexion';
