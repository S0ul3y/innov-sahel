import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * RolesGuard — vérifie que l'utilisateur connecté possède le rôle requis.
 *
 * Règle hiérarchique :
 *   super_admin → passe toujours (même les routes @Roles(Role.ADMIN) ou @Roles(Role.PORTEUR))
 *   admin       → passe les routes @Roles(Role.ADMIN)
 *   porteur     → passe uniquement les routes @Roles(Role.PORTEUR)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Pas de restriction de rôle définie → accès autorisé
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Accès refusé : vous devez être connecté.');
    }

    // Super Admin passe toutes les vérifications de rôle (hiérarchie)
    if (user.role === Role.SUPER_ADMIN) {
      return true;
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Accès refusé : rôle requis : ${requiredRoles.join(' ou ')}.`,
      );
    }

    return true;
  }
}
