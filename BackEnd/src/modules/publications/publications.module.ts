import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationsController } from './publications.controller';
import { PublicationsService } from './publications.service';
import { PublicationEntity } from './entities/publication.entity';

import { MediaModule } from '../media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([PublicationEntity]), MediaModule],
  controllers: [PublicationsController],
  providers: [PublicationsService],
  exports: [PublicationsService],
})
export class PublicationsModule {}
