import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { getDatabaseConfig } from './config/database.config';

// Modules métier
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommunesModule } from './modules/communes/communes.module';
import { InitiativesModule } from './modules/initiatives/initiatives.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { CommentsModule } from './modules/comments/comments.module';
import { ContributionsModule } from './modules/contributions/contributions.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';


@Module({
  imports: [
    // ─── Configuration (.env) ────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,  // Accessible dans tous les modules sans import
      envFilePath: '.env',
    }),

    // ─── Base de données ─────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),

    // ─── Rate Limiting (anti-spam) ───────────────────────────────
    // 100 requêtes max par minute par IP (pour les routes publiques)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,   // 1 seconde
        limit: 5,    // 5 requêtes max par seconde
      },
      {
        name: 'medium',
        ttl: 60000,  // 1 minute
        limit: 100,  // 100 requêtes max par minute
      },
    ]),

    // ─── Modules métier ──────────────────────────────────────────
    AuthModule,
    UsersModule,
    CommunesModule,
    InitiativesModule,
    PublicationsModule,
    CommentsModule,
    ContributionsModule,
    DashboardModule,
    NotificationsModule,
    UploadsModule,
  ],
})
export class AppModule {}
