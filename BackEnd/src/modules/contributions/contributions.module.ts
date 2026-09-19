import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContributionsController } from './contributions.controller';
import { ContributionsService } from './contributions.service';
import { ContributionEntity } from './entities/contribution.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContributionEntity]),
    NotificationsModule,
  ],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
