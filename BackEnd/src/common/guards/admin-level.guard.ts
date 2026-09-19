import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminLevel, Role } from '../enums/role.enum';
import { ADMIN_LEVEL_KEY } from '../decorators/admin-level.decorator';

/**
 * AdminLevelGuard — séparation des responsabilités entre les 2 admins.
 *
 * Admin Principal (adminLevel: 'principal') → accès total admin
 * Admin Suivi    (adminLevel: 'suivi')     → accès limité (lecture + modération)
 *
 * Périmètre EXCLUSIF Admin Principal :
 *   - Créer / suspendre / supprimer des comptes porteurs
 *   - Réinitialiser un mot de passe porteur
 *   - Gérer les fiches des communes
 *   - Gérer les contenus institutionnels (À propos, mentions légales)
 *
 * Utilisation : @UseGuards(JwtAuthGuard, RolesGuard, AdminLevelGuard)
 *             + @RequireAdminLevel(AdminLevel.PRINCIPAL)
 */
@Injectable()
export class AdminLevelGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevel = this.reflector.getAllAndOverride<AdminLevel>(
      ADMIN_LEVEL_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Pas de restriction de niveau → les 2 admins peuvent accéder
    if (!requiredLevel) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Si l'utilisateur n'est pas admin, le RolesGuard a déjà bloqué
    if (!user || user.role !== Role.ADMIN) {
      throw new ForbiddenException("Accès réservé aux administrateurs.");
    }

    // Vérification du niveau d'admin
    if (requiredLevel === AdminLevel.PRINCIPAL && user.adminLevel !== AdminLevel.PRINCIPAL) {
      throw new ForbiddenException(
        "Accès refusé : cette action est réservée à l'Administrateur Principal.",
      );
    }

    return true;
  }
}
