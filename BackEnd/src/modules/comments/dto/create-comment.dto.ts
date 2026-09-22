import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ required: false, example: 'uuid-publication' })
  @IsOptional() @IsString()
  publicationId?: string;

  @ApiProperty({ required: false, example: 'uuid-initiative' })
  @IsOptional() @IsString()
  initiativeId?: string;

  @ApiProperty({ example: 'Mamadou' })
  @IsString()
  @MinLength(1) @MaxLength(50)
  authorName: string;

  @ApiProperty({ required: false, enum: ['citoyen', 'porteur', 'admin'], default: 'citoyen' })
  @IsOptional() @IsString()
  authorRole?: 'citoyen' | 'porteur' | 'admin';

  @ApiProperty({ example: 'Très belle initiative, bravo !' })
  @IsString()
  @MinLength(2, { message: 'Le commentaire est trop court.' })
  @MaxLength(1000, { message: 'Le commentaire ne doit pas dépasser 1000 caractères.' })
  message: string;
}

export class ReplyCommentDto {
  @ApiProperty({ example: 'Merci pour votre commentaire !' })
  @IsString()
  @MinLength(1) @MaxLength(500)
  replyText: string;
}
