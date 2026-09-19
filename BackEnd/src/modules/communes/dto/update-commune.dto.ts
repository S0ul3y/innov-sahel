import { IsOptional, IsString, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommuneDto {
  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  mayor?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  mayorTeam?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  townHallAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  townHallPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  townHallEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  openingHours?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional() @IsArray()
  services?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional() @IsArray()
  neighborhoods?: string[];

  @ApiProperty({ required: false })
  @IsOptional() @IsObject()
  socialLinks?: { facebook?: string; twitter?: string; website?: string };

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  whatsappChannelUrl?: string;
}
