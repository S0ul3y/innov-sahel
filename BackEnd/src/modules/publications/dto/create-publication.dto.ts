import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PublicationType, PublicationFormat, PublicationStatus } from '../entities/publication.entity';

export class CreatePublicationDto {
  @ApiProperty({ enum: ['commune_news', 'initiative_update', 'activity'] })
  @IsEnum(['commune_news', 'initiative_update', 'activity'])
  type: PublicationType;

  @ApiProperty({ enum: ['carousel', 'video'], default: 'carousel' })
  @IsOptional() @IsEnum(['carousel', 'video'])
  format?: PublicationFormat;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  initiativeId?: string;

  @ApiProperty({ example: 'c1' })
  @IsString()
  communeId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  metaDescription?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  coverImage?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsArray()
  carouselImages?: Array<{ url: string; caption?: string }>;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  youtubeUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  youtubeId?: string;

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  authorName?: string;

  @ApiProperty({ required: false, enum: ['admin', 'porteur'] })
  @IsOptional() @IsEnum(['admin', 'porteur'])
  authorRole?: 'admin' | 'porteur';

  @ApiProperty({ required: false })
  @IsOptional() @IsString()
  date?: string;

  @ApiProperty({ enum: ['draft', 'published'], default: 'published' })
  @IsOptional() @IsEnum(['draft', 'published'])
  publicationStatus?: PublicationStatus;
}
