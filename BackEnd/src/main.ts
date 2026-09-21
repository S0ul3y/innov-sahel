import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ─── Fichiers statiques — images uploadées (système centralisé) ──────────
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  app.useStaticAssets(join(process.cwd(), 'uploads', 'Images', 'optimized'), { prefix: '/images/optimized' });
  app.useStaticAssets(join(process.cwd(), 'uploads', 'Images', 'thumbnails'), { prefix: '/images/thumbnails' });


  // ─── Préfixe global ───────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── CORS ─────────────────────────────────────────────────
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ─── Validation globale (class-validator) ─────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Supprime les champs non déclarés dans les DTO
      forbidNonWhitelisted: true,
      transform: true,          // Transforme automatiquement les types (string → number…)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Filtre d'exceptions global ───────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ─── Interceptor de logs global ───────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ─── Swagger UI (Documentation API) ──────────────────────
  const config = new DocumentBuilder()
    .setTitle('InnovSahel API')
    .setDescription(
      'API REST de la plateforme citoyenne InnovSahel — District de Bamako\n\n' +
      '**Authentification :** Utilisez le bouton "Authorize" avec votre Bearer token JWT.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentification et gestion de session')
    .addTag('Users', 'Gestion des comptes (Admin + Porteur)')
    .addTag('Communes', 'Fiches des 6 communes du District de Bamako')
    .addTag('Initiatives', "Fiches d'initiatives portées par les jeunes et les femmes")
    .addTag('Publications', "Actualités de commune et actualités d'initiative")
    .addTag('Comments', 'Commentaires publics et modération')
    .addTag('Contributions', 'Idées et signalements citoyens')
    .addTag('Dashboard', 'Statistiques et tableau de bord administrateur')
    .addTag('Uploads', 'Téléversement d\'images pour publications et initiatives')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`\n🚀 InnovSahel API démarrée sur : http://localhost:${port}/api`);
  console.log(`📖 Documentation Swagger : http://localhost:${port}/api/docs\n`);
}

bootstrap();
