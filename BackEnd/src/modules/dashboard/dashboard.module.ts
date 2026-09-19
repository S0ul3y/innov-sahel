import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserEntity } from '../users/entities/user.entity';
import { InitiativeEntity } from '../initiatives/entities/initiative.entity';
import { PublicationEntity } from '../publications/entities/publication.entity';
import { CommentEntity } from '../comments/entities/comment.entity';
import { ContributionEntity } from '../contributions/entities/contribution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      InitiativeEntity,
      PublicationEntity,
      CommentEntity,
      ContributionEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
