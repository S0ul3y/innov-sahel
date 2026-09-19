/**
 * Rôles de l'application InnovSahel
 * - ADMIN    : Administrateur IMPACT SAHEL (2 niveaux : principal / suivi)
 * - PORTEUR  : Porteur d'initiative (jeune ou femme du Lab'Citoyen)
 *
 * Le visiteur citoyen n'a pas de rôle : il accède aux routes publiques sans token.
 */
export enum Role {
  ADMIN = 'admin',
  PORTEUR = 'porteur',
}

/**
 * Niveau de responsabilité des administrateurs
 * - PRINCIPAL : Admin 1 — Moussa Cissé — plein accès
 * - SUIVI     : Admin 2 — Aminata Traoré — accès lecture + modération
 */
export enum AdminLevel {
  PRINCIPAL = 'principal',
  SUIVI = 'suivi',
}
