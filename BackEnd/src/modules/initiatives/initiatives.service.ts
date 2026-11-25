import {
  Injectable, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InitiativeEntity } from './entities/initiative.entity';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { UserEntity } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class InitiativesService {
  constructor(
    @InjectRepository(InitiativeEntity)
    private readonly repo: Repository<InitiativeEntity>,
  ) {}

  async findAll(communeId?: string): Promise<InitiativeEntity[]> {
    const qb = this.repo.createQueryBuilder('initiative')
      .where('initiative.isVisible = :isVisible', { isVisible: true })
      .andWhere('initiative.ownerUserId IS NOT NULL');
    if (communeId) {
      qb.andWhere('initiative.communeId = :communeId', { communeId });
    }
    return qb.orderBy('initiative.isPinned', 'DESC').addOrderBy('initiative.createdAt', 'DESC').getMany();
  }

  // Admin view — porteur voit seulement ses initiatives, admin/super_admin voient tout
  async findAllAdmin(user: UserEntity, communeId?: string): Promise<InitiativeEntity[]> {
    const where: any = {};
    if (communeId) where.communeId = communeId;
    if (user.role === Role.PORTEUR) {
      where.ownerUserId = user.id;
    }
    return this.repo.find({ where, order: { isPinned: 'DESC', createdAt: 'DESC' } });
  }


  async findOne(id: string): Promise<InitiativeEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    // Incrément de vue
    await this.repo.increment({ id }, 'viewsCount', 1);
    return item;
  }

  async create(dto: CreateInitiativeDto, user: UserEntity): Promise<InitiativeEntity> {
    if (user.role === Role.PORTEUR) {
      throw new ForbiddenException("Un porteur d'initiative ne peut pas créer d'initiative. Seul un administrateur peut créer une initiative.");
    }
    const initiative = this.repo.create({
      ...dto,
      ownerUserId: (dto as any).ownerUserId || null,
      ownerName: dto.ownerName || user.name,
    });
    return this.repo.save(initiative);
  }

  async update(id: string, dto: UpdateInitiativeDto, user: UserEntity): Promise<InitiativeEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    if (user.role === Role.PORTEUR && item.ownerUserId !== user.id) {
      throw new ForbiddenException("Vous ne pouvez modifier que vos propres initiatives.");
    }
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async toggleVisibility(id: string): Promise<InitiativeEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    item.isVisible = !item.isVisible;
    return this.repo.save(item);
  }

  async togglePinned(id: string): Promise<InitiativeEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    item.isPinned = !item.isPinned;
    return this.repo.save(item);
  }

  async remove(id: string): Promise<{ message: string }> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    await this.repo.remove(item);
    return { message: 'Initiative supprimée.' };
  }
}
