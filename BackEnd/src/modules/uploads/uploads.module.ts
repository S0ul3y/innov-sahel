import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './uploads.controller';

import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    MediaModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadsController],
})
export class UploadsModule {}
