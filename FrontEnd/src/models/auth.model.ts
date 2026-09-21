export type UserRole = 'visitor' | 'porteur' | 'admin' | 'super_admin';
export type AdminLevel = 'principal' | 'suivi';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'porteur';
  adminLevel?: AdminLevel | null;
  communeId?: string;
  initiativeName?: string;
  status: 'actif' | 'suspendu';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ─── Helpers de rôle ────────────────────────────────────────────────────────
export const isSuperAdmin = (user: AuthUser | null): boolean =>
  user?.role === 'super_admin';

export const isPlatformAdmin = (user: AuthUser | null): boolean =>
  user?.role === 'admin';

export const isPorteur = (user: AuthUser | null): boolean =>
  user?.role === 'porteur';

/** Retourne true si l'utilisateur a accès à l'espace admin (super_admin ou admin) */
export const hasFullAdminAccess = (user: AuthUser | null): boolean =>
  user?.role === 'super_admin' || user?.role === 'admin';

/** Retourne true si l'utilisateur peut accéder à l'espace admin (y compris porteur) */
export const hasAdminAccess = (user: AuthUser | null): boolean =>
  user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'porteur';

/** Libellé du rôle pour l'affichage */
export const getRoleLabel = (user: AuthUser | null): string => {
  if (!user) return '';
  switch (user.role) {
    case 'super_admin': return 'Super Administrateur';
    case 'admin': return 'Administrateur Platform';
    case 'porteur': return 'Porteur d\'Initiative';
    default: return '';
  }
};

/** Badge couleur du rôle */
export const getRoleBadgeColor = (user: AuthUser | null): string => {
  if (!user) return '';
  switch (user.role) {
    case 'super_admin': return 'bg-yellow-400/20 text-yellow-300 border-yellow-500/30';
    case 'admin': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'porteur': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default: return '';
  }
};

