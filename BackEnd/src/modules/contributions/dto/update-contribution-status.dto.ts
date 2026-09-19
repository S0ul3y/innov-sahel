import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContributionStatus } from '../entities/contribution.entity';

export class UpdateContributionStatusDto {
  @ApiProperty({ enum: ['nouveau', 'vu', 'transmis', 'cloture'] })
  @IsEnum(['nouveau', 'vu', 'transmis', 'cloture'])
  status: ContributionStatus;

  @ApiProperty({ required: false, example: 'Transmis à la Mairie le 15/01/2025' })
  @IsOptional() @IsString()
  internalNotes?: string;
}
