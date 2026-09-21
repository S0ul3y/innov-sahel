import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * SuperAdminGuard — route exclusivement réservée au Super Administrateur.
 *
 * Utilisation : @UseGuards(JwtAuthGuard, SuperAdminGuard)
 * Seul Role.SUPER_ADMIN peut passer. Admin et Porteur → 403.
 */
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Accès refusé : vous devez être connecté.');
    }

    if (user.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException(
        'Accès refusé : réservé au Super Administrateur.',
      );
    }

    return true;
  }
}
