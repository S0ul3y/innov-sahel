import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Décorateur @Roles — applique une restriction de rôle sur un endpoint.
 *
 * @example
 * @Roles(Role.ADMIN)                 // Admins seulement
 * @Roles(Role.ADMIN, Role.PORTEUR)   // Admins OU porteurs
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
