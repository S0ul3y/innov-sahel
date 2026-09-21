import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { MediaService } from '../media/media.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';

const memStorage = memoryStorage();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly mediaService: MediaService) {}

  // ─── POST /api/uploads/image ── Upload d'une image unique ────────────────────
  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', { storage: memStorage, limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: 'Téléverser une image unique (traitement Sharp centralisé)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserEntity,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni.');
    const result = await this.mediaService.processAndSave(file, {
      uploadedBy: user.id,
      role: 'cover',
    });
    return {
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      originalName: file.originalname,
      size: result.asset.size,
    };
  }

  // ─── POST /api/uploads/images ── Upload multiple (carrousel) ─────────────────
  @Post('images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memStorage, limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: 'Téléverser plusieurs images (carrousel avec Sharp centralisé)' })
  @ApiConsumes('multipart/form-data')
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: UserEntity,
  ) {
    if (!files || files.length === 0) throw new BadRequestException('Aucun fichier fourni.');
    const results = await this.mediaService.processAndSaveMultiple(files, {
      uploadedBy: user.id,
      role: 'gallery',
    });
    return results.map((r, i) => ({
      url: r.url,
      thumbnailUrl: r.thumbnailUrl,
      originalName: files[i].originalname,
      size: r.asset.size,
    }));
  }
}

