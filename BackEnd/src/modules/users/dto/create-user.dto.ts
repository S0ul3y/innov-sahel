import { IsEmail, IsString, IsOptional, MinLength, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la création d'un compte Porteur par l'Admin Principal.
 * Les porteurs ne peuvent pas s'inscrire librement (§10.1 du cahier des charges).
 */
export class CreateUserDto {
  @ApiProperty({ example: 'Fatoumata Diallo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'fatoumata.diallo@example.org' })
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  email: string;

  @ApiProperty({ example: '+223 76 12 34 56', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'c1', description: 'ID de la commune du porteur' })
  @IsString()
  communeId: string;

  @ApiProperty({ example: 'Sanuya Plastique : Pavés Écologiques', required: false })
  @IsOptional()
  @IsString()
  initiativeName?: string;

  // Mot de passe temporaire — le porteur devra le changer à sa 1ère connexion
  @ApiProperty({ example: 'TempPass123!', description: 'Mot de passe temporaire' })
  @IsString()
  @MinLength(6)
  temporaryPassword: string;
}
