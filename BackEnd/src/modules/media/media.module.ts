import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAssetEntity } from './entities/media-asset.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAssetEntity])],
  controllers: [MediaController],
  providers: [MediaService],
  // Exporter MediaService pour que les autres modules (initiatives, publications, contributions) puissent l'injecter
  exports: [MediaService],
})
export class MediaModule {}
