import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '../modules/users/entities/user.entity';
import { CommuneEntity } from '../modules/communes/entities/commune.entity';
import { InitiativeEntity } from '../modules/initiatives/entities/initiative.entity';
import { PublicationEntity } from '../modules/publications/entities/publication.entity';
import { CommentEntity } from '../modules/comments/entities/comment.entity';
import { ContributionEntity } from '../modules/contributions/entities/contribution.entity';
import { MediaAssetEntity } from '../modules/media/entities/media-asset.entity';

export const ALL_ENTITIES = [
  UserEntity,
  CommuneEntity,
  InitiativeEntity,
  PublicationEntity,
  CommentEntity,
  ContributionEntity,
  MediaAssetEntity,
];

// Configuration TypeORM avec entités explicites et autoLoadEntities
export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE || 'mysql';

  // ─── MySQL / MariaDB (Développement & phpMyAdmin) ─────────
  if (dbType === 'mysql') {
    return {
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
      database: process.env.DB_DATABASE || 'innovsahel_db',
      entities: ALL_ENTITIES,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Crée/met à jour automatiquement les tables en dev
      charset: 'utf8mb4_unicode_ci',
      timezone: 'Z',
      logging: process.env.NODE_ENV === 'development',
    };
  }

  // ─── PostgreSQL (Production) ──────────────────────────────
  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ALL_ENTITIES,
      autoLoadEntities: true,
      synchronize: false, // Jamais true en prod — utiliser les migrations
      logging: false,
      ssl: { rejectUnauthorized: false },
    };
  }

  // ─── Fallback SQLite / sql.js ─────────────────────────────
  return {
    type: 'sqljs',
    location: process.env.DB_DATABASE || './innovsahel.db',
    autoSave: true,
    entities: ALL_ENTITIES,
    autoLoadEntities: true,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  } as any;
};
