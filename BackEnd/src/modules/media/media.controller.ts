import {
  Controller, Post, Get, Delete, Param,
  UseGuards, UseInterceptors, UploadedFile, UploadedFiles,
  BadRequestException, Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../users/entities/user.entity';
import { MediaRole } from './entities/media-asset.entity';

// Multer utilise le stockage en mémoire — Sharp lira le buffer directement
const memStorage = memoryStorage();

const MAX_MULTER_SIZE = 12 * 1024 * 1024; // 12 MB à la réception (limite Multer avant Sharp)

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaSvc: MediaService) {}

  // ─── POST /api/media/upload ── Upload image unique (authentifié) ──────────
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Téléverser une image unique — validation magic bytes + Sharp WebP [ADMIN/PORTEUR]' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        role: { type: 'string', enum: ['cover', 'gallery', 'photo', 'avatar', 'other'] },
        linkedEntityType: { type: 'string' },
        linkedEntityId: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { storage: memStorage, limits: { fileSize: MAX_MULTER_SIZE } }))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: UserEntity,
    @Query('role') role?: MediaRole,
    @Query('linkedEntityType') linkedEntityType?: string,
    @Query('linkedEntityId') linkedEntityId?: string,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni.');
    const result = await this.mediaSvc.processAndSave(file, {
      uploadedBy: user.id,
      role: role || 'other',
      linkedEntityType,
      linkedEntityId,
    });
    return {
      id: result.asset.id,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      filename: result.asset.filename,
      width: result.asset.width,
      height: result.asset.height,
      size: result.asset.size,
    };
  }

  // ─── POST /api/media/upload-multiple ── Upload multiple (carrousel) ────────
  @Post('upload-multiple')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Téléverser jusqu\'à 10 images (carrousel) [ADMIN/PORTEUR]' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, { storage: memStorage, limits: { fileSize: MAX_MULTER_SIZE } }))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: UserEntity,
    @Query('role') role?: MediaRole,
    @Query('linkedEntityType') linkedEntityType?: string,
    @Query('linkedEntityId') linkedEntityId?: string,
  ) {
    if (!files || files.length === 0) throw new BadRequestException('Aucun fichier fourni.');
    const results = await this.mediaSvc.processAndSaveMultiple(files, {
      uploadedBy: user.id,
      role: role || 'gallery',
      linkedEntityType,
      linkedEntityId,
    });
    return results.map(r => ({
      id: r.asset.id,
      url: r.url,
      thumbnailUrl: r.thumbnailUrl,
      filename: r.asset.filename,
      width: r.asset.width,
      height: r.asset.height,
      size: r.asset.size,
    }));
  }

  // ─── POST /api/media/upload-public ── Upload sans auth (contributions) ─────
  @Post('upload-public')
  @ApiOperation({ summary: 'Téléverser une image sans authentification (contributions citoyennes)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memStorage, limits: { fileSize: MAX_MULTER_SIZE } }))
  async uploadPublic(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni.');
    const result = await this.mediaSvc.processAndSave(file, {
      uploadedBy: 'public',
      role: 'photo',
      generateThumbnail: true,
    });
    return {
      id: result.asset.id,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
    };
  }

  // ─── GET /api/media/entity/:type/:id ── Lister les médias d'une entité ─────
  @Get('entity/:type/:id')
  @ApiOperation({ summary: 'Lister les médias liés à une entité [PUBLIC]' })
  findByEntity(@Param('type') type: string, @Param('id') id: string) {
    return this.mediaSvc.findByEntity(type, id);
  }

  // ─── DELETE /api/media/:id ── Supprimer un média [ADMIN] ──────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer définitivement un média (fichier + BDD) [ADMIN]' })
  deleteAsset(@Param('id') id: string) {
    return this.mediaSvc.deleteAsset(id);
  }
}
