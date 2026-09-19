import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContributionEntity } from './entities/contribution.entity';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionStatusDto } from './dto/update-contribution-status.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(ContributionEntity)
    private readonly repo: Repository<ContributionEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── PUBLIC : Soumettre une contribution ────────────────────────────────────
  async create(dto: CreateContributionDto): Promise<{ message: string }> {
    const contribution = this.repo.create(dto);
    const saved = await this.repo.save(contribution);

    // Déclenche l'email de notification aux admins (§7.6 cahier des charges)
    await this.notificationsService.sendContributionNotification(saved);

    // Message citoyen — aucune réponse individuelle, aucun suivi (§7.5)
    return {
      message:
        "Merci ! Votre message a bien été reçu. Il sera transmis aux responsables de votre commune. " +
        "Votre participation contribue à améliorer la vie de votre quartier.",
    };
  }

  // ─── ADMIN : Lister toutes les contributions ────────────────────────────────
  async findAll(filters: {
    type?: string;
    communeId?: string;
    status?: string;
  } = {}): Promise<ContributionEntity[]> {
    // On inclut les coordonnées citoyennes pour les admins
    const qb = this.repo
      .createQueryBuilder('c')
      .addSelect('c.citizenName')
      .addSelect('c.citizenPhone')
      .orderBy('c.createdAt', 'DESC');

    if (filters.type) qb.andWhere('c.type = :type', { type: filters.type });
    if (filters.communeId) qb.andWhere('c.communeId = :communeId', { communeId: filters.communeId });
    if (filters.status) qb.andWhere('c.internalStatus = :status', { status: filters.status });

    return qb.getMany();
  }

  // ─── ADMIN : Détail d'une contribution ──────────────────────────────────────
  async findOne(id: string): Promise<ContributionEntity> {
    const item = await this.repo
      .createQueryBuilder('c')
      .addSelect('c.citizenName')
      .addSelect('c.citizenPhone')
      .where('c.id = :id', { id })
      .getOne();

    if (!item) throw new NotFoundException('Contribution introuvable.');
    return item;
  }

  // ─── ADMIN : Mettre à jour le statut ────────────────────────────────────────
  async updateStatus(id: string, dto: UpdateContributionStatusDto): Promise<ContributionEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Contribution introuvable.');
    item.internalStatus = dto.status;
    if (dto.internalNotes !== undefined) item.internalNotes = dto.internalNotes;
    return this.repo.save(item);
  }

  // ─── ADMIN : Supprimer ──────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Contribution introuvable.');
    await this.repo.remove(item);
    return { message: 'Contribution supprimée.' };
  }

  // ─── ADMIN : Export CSV ──────────────────────────────────────────────────────
  async exportCsv(): Promise<string> {
    const contributions = await this.findAll();
    const header = 'id,type,communeId,category,description,locationText,internalStatus,createdAt\n';
    const rows = contributions.map(c =>
      [
        c.id, c.type, c.communeId, c.category,
        `"${c.description.replace(/"/g, '""')}"`,
        c.locationText || '',
        c.internalStatus,
        c.createdAt.toISOString(),
      ].join(',')
    ).join('\n');
    return header + rows;
  }
}
