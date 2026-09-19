import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitiativesController } from './initiatives.controller';
import { InitiativesService } from './initiatives.service';
import { InitiativeEntity } from './entities/initiative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InitiativeEntity])],
  controllers: [InitiativesController],
  providers: [InitiativesService],
  exports: [InitiativesService],
})
export class InitiativesModule {}
