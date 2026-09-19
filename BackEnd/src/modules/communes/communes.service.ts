import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommuneEntity } from './entities/commune.entity';
import { UpdateCommuneDto } from './dto/update-commune.dto';

@Injectable()
export class CommunesService {
  constructor(
    @InjectRepository(CommuneEntity)
    private readonly communeRepository: Repository<CommuneEntity>,
  ) {}

  async findAll(): Promise<CommuneEntity[]> {
    return this.communeRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: string): Promise<CommuneEntity> {
    const commune = await this.communeRepository.findOne({ where: { id } });
    if (!commune) throw new NotFoundException(`Commune "${id}" introuvable.`);
    return commune;
  }

  async update(id: string, dto: UpdateCommuneDto): Promise<CommuneEntity> {
    const commune = await this.findOne(id);
    Object.assign(commune, dto);
    return this.communeRepository.save(commune);
  }
}
