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

  async getStats(user?: UserEntity) {
    if (user && user.role === Role.PORTEUR) {
      const porteurInitiatives = await this.initiativeRepo.find({
        where: { ownerUserId: user.id },
        order: { createdAt: 'DESC' },
      });
      const initiativeIds = porteurInitiatives.map(i => i.id);

      const totalViews = porteurInitiatives.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

      let totalComments = 0;
      let totalCommentsReported = 0;
      let recentComments: CommentEntity[] = [];

      if (initiativeIds.length > 0) {
        totalComments = await this.commentRepo
          .createQueryBuilder('c')
          .where('c.initiativeId IN (:...ids)', { ids: initiativeIds })
          .getCount();

        totalCommentsReported = await this.commentRepo
          .createQueryBuilder('c')
          .where('c.initiativeId IN (:...ids) AND c.reported = :rep', { ids: initiativeIds, rep: true })
          .getCount();

        recentComments = await this.commentRepo
          .createQueryBuilder('c')
          .where('c.initiativeId IN (:...ids)', { ids: initiativeIds })
          .orderBy('c.createdAt', 'DESC')
          .take(10)
          .getMany();
      }

      return {
        isPorteur: true,
        initiatives: {
          total: porteurInitiatives.length,
          list: porteurInitiatives,
        },
        views: {
          total: totalViews,
        },
        comments: {
          total: totalComments,
          reported: totalCommentsReported,
          recent: recentComments,
        },
        users: {
          totalPorteurs: 1,
          totalPorteursActifs: user.status === 'actif' ? 1 : 0,
          totalPorteursSuspendus: user.status === 'actif' ? 0 : 1,
        },
        contributions: {
          total: 0,
          idees: 0,
          signalements: 0,
          nouveau: 0,
          byStatus: [],
        },
        recent: {
          publications: [],
          contributions: [],
        },
      };
    }

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
