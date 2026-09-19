import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO de mise à jour du profil — tous les champs sont optionnels.
 * On exclut temporaryPassword car la modification du mot de passe
 * passe par le module Auth (ChangePasswordDto).
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['temporaryPassword'] as const),
) {}
