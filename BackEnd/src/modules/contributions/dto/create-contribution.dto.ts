import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContributionType } from '../entities/contribution.entity';

export class CreateContributionDto {
  @ApiProperty({ enum: ['idee', 'signalement'] })
  @IsEnum(['idee', 'signalement'])
  type: ContributionType;

  @ApiProperty({ example: 'c1' })
  @IsString()
  communeId: string;

  @ApiProperty({ example: 'Environnement et assainissement' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Les ordures s\'accumulent depuis 3 semaines...' })
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  photoUrl?: string;

  @ApiProperty({ required: false, example: 'Quartier Korofina, devant l\'école' })
  @IsOptional() @IsString()
  locationText?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsObject()
  gpsCoordinates?: { lat: number; lng: number };

  // Facultatif — §7.3 / §7.4
  @ApiProperty({ required: false, example: 'Aminata' })
  @IsOptional() @IsString()
  citizenName?: string;

  @ApiProperty({ required: false, example: '+223 70 00 00 00' })
  @IsOptional() @IsString()
  citizenPhone?: string;
}
