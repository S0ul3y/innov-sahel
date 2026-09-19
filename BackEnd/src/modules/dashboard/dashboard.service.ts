import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { InitiativeEntity } from '../initiatives/entities/initiative.entity';
import { PublicationEntity } from '../publications/entities/publication.entity';
import { CommentEntity } from '../comments/entities/comment.entity';
import { ContributionEntity } from '../contributions/entities/contribution.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(InitiativeEntity)
    private readonly initiativeRepo: Repository<InitiativeEntity>,
    @InjectRepository(PublicationEntity)
    private readonly publicationRepo: Repository<PublicationEntity>,
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(ContributionEntity)
    private readonly contributionRepo: Repository<ContributionEntity>,
  ) {}

  async getStats() {
    const [
      totalPorteurs,
      totalPorteursActifs,
      totalInitiatives,
      totalPublications,
      totalComments,
      totalCommentsReported,
      totalContributions,
      totalIdees,
      totalSignalements,
      newContributions,
      totalViews,
    ] = await Promise.all([
      this.userRepo.count({ where: { role: Role.PORTEUR } }),
      this.userRepo.count({ where: { role: Role.PORTEUR, status: 'actif' } }),
      this.initiativeRepo.count(),
      this.publicationRepo.count({ where: { publicationStatus: 'published' } }),
      this.commentRepo.count(),
      this.commentRepo.count({ where: { reported: true } }),
      this.contributionRepo.count(),
      this.contributionRepo.count({ where: { type: 'idee' } }),
      this.contributionRepo.count({ where: { type: 'signalement' } }),
      this.contributionRepo.count({ where: { internalStatus: 'nouveau' } }),
      this.publicationRepo
        .createQueryBuilder('p')
        .select('SUM(p.viewsCount)', 'total')
        .getRawOne()
        .then(r => parseInt(r?.total || '0', 10)),
    ]);

    // Contributions par statut
    const contributionsByStatus = await this.contributionRepo
      .createQueryBuilder('c')
      .select('c.internalStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.internalStatus')
      .getRawMany();

    // Initiatives par commune
    const initiativesByCommune = await this.initiativeRepo
      .createQueryBuilder('i')
      .select('i.communeId', 'communeId')
      .addSelect('COUNT(*)', 'count')
      .groupBy('i.communeId')
      .getRawMany();

    // Publications récentes (5 dernières)
    const recentPublications = await this.publicationRepo.find({
      where: { publicationStatus: 'published' },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    // Contributions récentes (5 dernières)
    const recentContributions = await this.contributionRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      users: {
        totalPorteurs,
        totalPorteursActifs,
        totalPorteursSuspendus: totalPorteurs - totalPorteursActifs,
      },
      initiatives: {
        total: totalInitiatives,
        byCommune: initiativesByCommune,
      },
      publications: {
        total: totalPublications,
        totalViews,
      },
      comments: {
        total: totalComments,
        reported: totalCommentsReported,
      },
      contributions: {
        total: totalContributions,
        idees: totalIdees,
        signalements: totalSignalements,
        nouveau: newContributions,
        byStatus: contributionsByStatus,
      },
      recent: {
        publications: recentPublications,
        contributions: recentContributions,
      },
    };
  }
}
