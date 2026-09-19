import { SetMetadata } from '@nestjs/common';
import { AdminLevel } from '../enums/role.enum';

export const ADMIN_LEVEL_KEY = 'adminLevel';

/**
 * Décorateur @RequireAdminLevel — restreint une route aux admins d'un niveau minimum.
 *
 * Usage :
 * @RequireAdminLevel(AdminLevel.PRINCIPAL)  → seulement Admin Principal
 *
 * Si non appliqué sur une route @Roles(Role.ADMIN), les 2 admins peuvent accéder.
 */
export const RequireAdminLevel = (level: AdminLevel) =>
  SetMetadata(ADMIN_LEVEL_KEY, level);
