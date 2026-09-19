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
    const where: any = { isVisible: true };
    if (communeId) where.communeId = communeId;
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<InitiativeEntity> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    // Incrément de vue
    await this.repo.increment({ id }, 'viewsCount', 1);
    return item;
  }

  async create(dto: CreateInitiativeDto, user: UserEntity): Promise<InitiativeEntity> {
    const initiative = this.repo.create({
      ...dto,
      ownerUserId: user.role === Role.PORTEUR ? user.id : null,
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

  async remove(id: string): Promise<{ message: string }> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Initiative introuvable.');
    await this.repo.remove(item);
    return { message: 'Initiative supprimée.' };
  }
}
