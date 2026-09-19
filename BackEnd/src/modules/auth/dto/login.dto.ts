import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'moussa.cisse@impactsahel.org',
    description: 'Adresse email du compte',
  })
  @IsEmail({}, { message: "L'adresse email n'est pas valide." })
  email: string;

  @ApiProperty({ example: 'MonMotDePasse123!', description: 'Mot de passe' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password: string;
}
