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
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storageConfig = diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestException('Format non supporté. Utilisez JPG, PNG ou WebP.'), false);
  }
  cb(null, true);
};

@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {

  // ─── POST /api/uploads/image ── Upload d'une image unique ────────────────────
  @Post('image')
  @Roles(Role.ADMIN, Role.PORTEUR)
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig, fileFilter, limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: 'Téléverser une image unique' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier fourni.');
    return {
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    };
  }

  // ─── POST /api/uploads/images ── Upload multiple (carrousel) ─────────────────
  @Post('images')
  @Roles(Role.ADMIN, Role.PORTEUR)
  @UseInterceptors(FilesInterceptor('files', 20, { storage: storageConfig, fileFilter, limits: { fileSize: MAX_FILE_SIZE } }))
  @ApiOperation({ summary: 'Téléverser plusieurs images (carrousel)' })
  @ApiConsumes('multipart/form-data')
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) throw new BadRequestException('Aucun fichier fourni.');
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    }));
  }
}
