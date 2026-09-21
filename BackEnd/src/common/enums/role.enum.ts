/**
 * Rôles de l'application InnovSahel
 *
 * - SUPER_ADMIN : Super Administrateur — plein accès, seul à pouvoir créer des admins platform
 *                 et activer/désactiver tous les comptes (admin + porteur)
 * - ADMIN       : Administrateur Platform — gère tout sauf créer/gérer les admins
 * - PORTEUR     : Porteur d'initiative — gère uniquement son projet et ses commentaires
 *
 * Le visiteur citoyen n'a pas de rôle : il accède aux routes publiques sans token.
 */
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  PORTEUR = 'porteur',
}

/**
 * @deprecated — Remplacé par Role.SUPER_ADMIN / Role.ADMIN.
 * Conservé pour la compatibilité avec les anciennes données en base.
 */
export enum AdminLevel {
  PRINCIPAL = 'principal',
  SUIVI = 'suivi',
}

