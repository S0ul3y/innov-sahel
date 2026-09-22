import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationEntity, PublicationStatus } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { UserEntity } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(PublicationEntity)
    private readonly repo: Repository<PublicationEntity>,
  ) {}

  async findAll(filters: {
    communeId?: string;
    type?: string;
    initiativeId?: string;
    status?: PublicationStatus;
  } = {}): Promise<PublicationEntity[]> {
    const where: any = {};
    if (filters.communeId) where.communeId = filters.communeId;
    if (filters.type) where.type = filters.type;
    if (filters.initiativeId) where.initiativeId = filters.initiativeId;
    // Route publique → uniquement les publiées
    where.publicationStatus = filters.status || 'published';

    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  // Admin peut voir toutes les publications y compris les brouillons
  async findAllAdmin(filters: any = {}): Promise<PublicationEntity[]> {
    const where: any = {};
    if (filters.communeId) where.communeId = filters.communeId;
    if (filters.type) where.type = filters.type;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<PublicationEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Publication introuvable.');
    await this.repo.increment({ id }, 'viewsCount', 1);
    return item;
  }

  async create(dto: CreatePublicationDto, user: UserEntity): Promise<PublicationEntity> {
    // Extraction automatique de l'ID YouTube depuis l'URL
    let youtubeId = dto.youtubeId || null;
    if (dto.youtubeUrl && !youtubeId) {
      const match = dto.youtubeUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      );
      youtubeId = match ? match[1] : null;
    }

    const pub = this.repo.create({
      ...dto,
      authorUserId: user.id,
      authorName: dto.authorName || user.name,
      authorRole: dto.authorRole || ((user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) ? 'admin' : 'porteur'),
      youtubeId,
      date: dto.date || new Date().toISOString(),
    });
    return this.repo.save(pub);
  }

  async update(id: string, dto: UpdatePublicationDto, user: UserEntity): Promise<PublicationEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Publication introuvable.');
    if (user.role === Role.PORTEUR && item.authorUserId !== user.id) {
      throw new ForbiddenException("Vous ne pouvez modifier que vos propres publications.");
    }
    // Re-extraction youtubeId si l'URL change
    if (dto.youtubeUrl && dto.youtubeUrl !== item.youtubeUrl) {
      const match = dto.youtubeUrl.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      );
      (dto as any).youtubeId = match ? match[1] : null;
    }
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async updateStatus(id: string, status: PublicationStatus): Promise<PublicationEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Publication introuvable.');
    item.publicationStatus = status;
    return this.repo.save(item);
  }

  async remove(id: string): Promise<{ message: string }> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Publication introuvable.');
    await this.repo.remove(item);
    return { message: 'Publication supprimée.' };
  }
}
