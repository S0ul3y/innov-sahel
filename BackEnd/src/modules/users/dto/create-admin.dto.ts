import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la création d'un compte Admin Platform par le Super Administrateur.
 */
export class CreateAdminDto {
  @ApiProperty({ example: 'Aminata Traoré' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'aminata.traore@impactsahel.org' })
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  email: string;

  @ApiProperty({ example: '+223 70 12 34 56', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'TempAdmin123!', description: 'Mot de passe temporaire (optionnel, auto-généré si non renseigné)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  temporaryPassword?: string;
}
