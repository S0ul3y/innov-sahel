import {
  Injectable, BadRequestException, NotFoundException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAssetEntity, MediaRole } from './entities/media-asset.entity';
import type { Metadata } from 'sharp';
const sharp = require('sharp');
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// ─── Configuration ─────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB avant traitement
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const THUMB_WIDTH = 400;
const THUMB_HEIGHT = 300;
const WEBP_QUALITY = 82;
const THUMB_QUALITY = 70;

// Dossiers de stockage (relatifs à process.cwd())
const UPLOADS_BASE = 'uploads/Images';
const OPTIMIZED_DIR = path.join(UPLOADS_BASE, 'optimized');
const THUMBNAILS_DIR = path.join(UPLOADS_BASE, 'thumbnails');

// ─── Signatures magic bytes ──────────────────────────────────────────────────
const MAGIC_SIGNATURES = [
  { mime: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF], offset: 0 },
  { mime: 'image/png',  bytes: [0x89, 0x50, 0x4E, 0x47], offset: 0 },
  { mime: 'image/gif',  bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
  // WebP : "RIFF" aux octets 0-3, "WEBP" aux octets 8-11
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
];

export interface ProcessOptions {
  linkedEntityType?: string;
  linkedEntityId?: string;
  role?: MediaRole;
  uploadedBy?: string;
  generateThumbnail?: boolean; // default: true
}

export interface ProcessedMedia {
  asset: MediaAssetEntity;
  url: string;
  thumbnailUrl: string | null;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(MediaAssetEntity)
    private readonly repo: Repository<MediaAssetEntity>,
  ) {
    // S'assurer que les dossiers existent au démarrage
    this.ensureDirectories();
  }

  // ─── Validation magic bytes ────────────────────────────────────────────────
  private validateMagicBytes(buffer: Buffer): void {
    const isValid = MAGIC_SIGNATURES.some(sig => {
      return sig.bytes.every((byte, i) => buffer[sig.offset + i] === byte);
    });

    // Vérification WebP supplémentaire : octets 8-11 doivent être "WEBP"
    const isWebP = (
      buffer[0] === 0x52 && buffer[1] === 0x49 &&
      buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 &&
      buffer[10] === 0x42 && buffer[11] === 0x50
    );

    if (!isValid && !isWebP) {
      throw new BadRequestException(
        'Fichier invalide : le contenu ne correspond pas à une image (JPEG, PNG, WebP ou GIF). ' +
        'Les fichiers déguisés ou dangereux sont rejetés automatiquement.',
      );
    }
  }

  // ─── Traitement principal ──────────────────────────────────────────────────
  /**
   * Traite une image uploadée par multer (buffer en mémoire) :
   * 1. Valide les magic bytes
   * 2. Vérifie la taille
   * 3. Redimensionne et convertit en WebP via Sharp
   * 4. Génère une miniature
   * 5. Sauvegarde les fichiers sur disque
   * 6. Crée une entrée en base de données
   */
  async processAndSave(
    file: Express.Multer.File,
    options: ProcessOptions = {},
  ): Promise<ProcessedMedia> {
    const { generateThumbnail = true } = options;

    // 1. Vérification taille avant traitement
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Image trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum autorisé : 10 MB.`,
      );
    }

    // 2. Validation magic bytes (indépendant du MIME déclaré par le navigateur)
    this.validateMagicBytes(file.buffer);

    // 3. Génération d'un nom de fichier UUID imprévisible (jamais basé sur le nom utilisateur)
    const filename = `${uuidv4()}.webp`;
    const thumbnailFilename = generateThumbnail ? `${uuidv4()}.webp` : null;

    const optimizedPath = path.join(OPTIMIZED_DIR, filename);
    const thumbnailPath = thumbnailFilename
      ? path.join(THUMBNAILS_DIR, thumbnailFilename)
      : null;

    // 4. Traitement Sharp — image optimisée
    const optimizedBuffer = await sharp(file.buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const metadata = await sharp(optimizedBuffer).metadata();

    // 5. Génération de la miniature
    let thumbBuffer: Buffer | null = null;
    let thumbMeta: Metadata | null = null;
    if (generateThumbnail && thumbnailPath) {
      thumbBuffer = await sharp(file.buffer)
        .resize(THUMB_WIDTH, THUMB_HEIGHT, {
          fit: 'cover',
          position: 'centre',
        })
        .webp({ quality: THUMB_QUALITY })
        .toBuffer();
      thumbMeta = await sharp(thumbBuffer).metadata();
    }

    // 6. Écriture sur le disque
    fs.writeFileSync(optimizedPath, optimizedBuffer);
    if (thumbBuffer && thumbnailPath) {
      fs.writeFileSync(thumbnailPath, thumbBuffer);
    }

    this.logger.log(
      `Image traitée : ${filename} (${(optimizedBuffer.length / 1024).toFixed(0)}KB WebP depuis ${file.originalname})`,
    );

    // 7. Persistance en base de données
    const asset = this.repo.create({
      filename,
      originalName: file.originalname,
      mimeType: 'image/webp',
      size: optimizedBuffer.length,
      width: metadata.width || 0,
      height: metadata.height || 0,
      thumbnailFilename: thumbnailFilename || null,
      thumbnailSize: thumbBuffer?.length || 0,
      linkedEntityType: options.linkedEntityType || null,
      linkedEntityId: options.linkedEntityId || null,
      role: options.role || 'other',
      uploadedBy: options.uploadedBy || null,
    });

    const saved = await this.repo.save(asset);

    return {
      asset: saved,
      url: `/images/optimized/${filename}`,
      thumbnailUrl: thumbnailFilename ? `/images/thumbnails/${thumbnailFilename}` : null,
    };
  }

  // ─── Traitement multiple ───────────────────────────────────────────────────
  async processAndSaveMultiple(
    files: Express.Multer.File[],
    options: ProcessOptions = {},
  ): Promise<ProcessedMedia[]> {
    return Promise.all(files.map(f => this.processAndSave(f, options)));
  }

  // ─── Liaison a posteriori ──────────────────────────────────────────────────
  async linkToEntity(
    assetId: string,
    entityType: string,
    entityId: string,
    role: MediaRole = 'other',
  ): Promise<void> {
    await this.repo.update(assetId, {
      linkedEntityType: entityType,
      linkedEntityId: entityId,
      role,
    });
  }

  // ─── Recherche par entité ──────────────────────────────────────────────────
  async findByEntity(entityType: string, entityId: string): Promise<MediaAssetEntity[]> {
    return this.repo.find({
      where: { linkedEntityType: entityType, linkedEntityId: entityId },
      order: { createdAt: 'ASC' },
    });
  }

  // ─── Suppression sécurisée ─────────────────────────────────────────────────
  async deleteAsset(id: string): Promise<{ message: string }> {
    const asset = await this.repo.findOne({ where: { id } });
    if (!asset) throw new NotFoundException('Média introuvable.');

    // Suppression des fichiers disque (silencieux si déjà absents)
    const optimizedPath = path.join(OPTIMIZED_DIR, asset.filename);
    if (fs.existsSync(optimizedPath)) fs.unlinkSync(optimizedPath);

    if (asset.thumbnailFilename) {
      const thumbPath = path.join(THUMBNAILS_DIR, asset.thumbnailFilename);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    await this.repo.remove(asset);
    this.logger.log(`Média supprimé : ${asset.filename}`);
    return { message: 'Média supprimé.' };
  }

  // ─── Utilitaire : s'assurer que les dossiers existent ─────────────────────
  private ensureDirectories(): void {
    [OPTIMIZED_DIR, THUMBNAILS_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.logger.log(`Dossier créé : ${dir}`);
      }
    });
  }
}
