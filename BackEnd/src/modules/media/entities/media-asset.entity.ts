import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

export type MediaRole = 'cover' | 'gallery' | 'photo' | 'avatar' | 'other';

/**
 * MediaAssetEntity — Catalogue centralisé de tous les médias de la plateforme.
 *
 * Chaque image uploadée génère une entrée ici, avec :
 * - Le chemin vers la version optimisée (WebP, max 1920×1080)
 * - Le chemin vers la miniature (WebP, max 400×300)
 * - Les métadonnées complètes (dimensions, taille, type)
 * - La liaison vers l'entité parente (initiative, publication, contribution)
 */
@Entity('media_assets')
export class MediaAssetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Nom du fichier optimisé (uuid.webp) — sans chemin */
  @Column()
  filename: string;

  /** Nom original fourni par le navigateur (conservé pour info) */
  @Column({ nullable: true })
  originalName: string;

  /** Toujours 'image/webp' après traitement Sharp */
  @Column({ default: 'image/webp' })
  mimeType: string;

  /** Taille en bytes de l'image optimisée */
  @Column({ default: 0 })
  size: number;

  /** Dimensions de l'image optimisée */
  @Column({ default: 0 })
  width: number;

  @Column({ default: 0 })
  height: number;

  /** Nom du fichier miniature (null si non générée) */
  @Column({ nullable: true })
  thumbnailFilename: string;

  @Column({ default: 0 })
  thumbnailSize: number;

  /** Type de l'entité parente (initiative, publication, contribution) */
  @Column({ nullable: true })
  linkedEntityType: string;

  /** ID de l'entité parente */
  @Column({ nullable: true })
  linkedEntityId: string;

  /** Rôle de l'image dans le contenu */
  @Column({
    type: 'simple-enum',
    enum: ['cover', 'gallery', 'photo', 'avatar', 'other'],
    default: 'other',
    nullable: true,
  })
  role: MediaRole;

  /** Qui a uploadé (userId ou 'public' pour les contributions anonymes) */
  @Column({ nullable: true })
  uploadedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
