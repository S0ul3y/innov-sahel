import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunesController } from './communes.controller';
import { CommunesService } from './communes.service';
import { CommuneEntity } from './entities/commune.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommuneEntity])],
  controllers: [CommunesController],
  providers: [CommunesService],
  exports: [CommunesService],
})
export class CommunesModule {}
