import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Ancien mot de passe' })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'Nouveau mot de passe (min 8 caractères, 1 majuscule, 1 chiffre)',
    example: 'NouveauPass123!',
  })
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
  @MaxLength(64)
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Le mot de passe doit contenir au moins une majuscule et un chiffre.',
  })
  newPassword: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "Nouveau mot de passe temporaire généré par l'Admin Principal",
    example: 'Temp123!',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
