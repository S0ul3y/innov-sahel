import { IsString, IsEnum, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OwnerType, InitiativeStatus } from '../entities/initiative.entity';

export class CreateInitiativeDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() ownerName: string;
  @ApiProperty({ enum: ['jeune', 'femme', 'collectif'] })
  @IsEnum(['jeune', 'femme', 'collectif']) ownerType: OwnerType;

  @ApiProperty({ required: false }) @IsOptional() @IsString() ownerBio?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() ownerAvatar?: string;
  @ApiProperty() @IsString() communeId: string;
  @ApiProperty() @IsString() domain: string;
  @ApiProperty() @IsString() problem: string;
  @ApiProperty() @IsString() solution: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() beneficiaries?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() startDate?: string;

  @ApiProperty({ enum: ['demarre', 'en_cours', 'termine'], default: 'demarre' })
  @IsOptional() @IsEnum(['demarre', 'en_cours', 'termine'])
  status?: InitiativeStatus;

  @ApiProperty({ required: false }) @IsOptional() @IsString() coverImage?: string;
  @ApiProperty({ required: false, type: 'array' })
  @IsOptional() @IsArray() gallery?: Array<{ url: string; caption?: string }>;

  @ApiProperty({ required: false }) @IsOptional() @IsString() videoUrl?: string;
}
