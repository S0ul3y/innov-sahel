import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Entités enregistrées automatiquement via glob pattern
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
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
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
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  } as any;
};
