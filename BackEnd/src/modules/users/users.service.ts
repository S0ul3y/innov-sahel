import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // ─── Créer un porteur (Admin Principal seulement) ───────────────────────────
  async createPorteur(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Un compte avec cet email existe déjà.');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.temporaryPassword, salt);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      password: hashedPassword,
      role: Role.PORTEUR,
      adminLevel: null,
      communeId: dto.communeId,
      initiativeName: dto.initiativeName || '',
      status: 'actif',
      mustChangePassword: true, // Force le changement à la 1ère connexion
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  // ─── Lister tous les porteurs ────────────────────────────────────────────────
  async findAllPorteurs(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find({
      where: { role: Role.PORTEUR },
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...u }) => u);
  }

  // ─── Lister tous les utilisateurs (admin + porteur) ─────────────────────────
  async findAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
    return users.map(({ password, ...u }) => u);
  }

  // ─── Trouver un utilisateur par ID ──────────────────────────────────────────
  async findOne(id: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    const { password, ...result } = user;
    return result;
  }

  // ─── Mettre à jour un utilisateur ───────────────────────────────────────────
  async update(
    id: string,
    dto: UpdateUserDto,
    requestingUser: UserEntity,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    // Un porteur ne peut modifier que son propre profil
    if (requestingUser.role === Role.PORTEUR && requestingUser.id !== id) {
      throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil.');
    }

    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  // ─── Supprimer un compte porteur (Admin Principal seulement) ────────────────
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Impossible de supprimer un compte administrateur.');
    }

    await this.userRepository.remove(user);
    return { message: `Le compte de "${user.name}" a été définitivement supprimé.` };
  }

  // ─── Activer / Suspendre un porteur ─────────────────────────────────────────
  async toggleStatus(id: string): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Impossible de suspendre un compte administrateur.');
    }

    user.status = user.status === 'actif' ? 'suspendu' : 'actif';
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  // ─── Interne : trouver par email avec mot de passe (pour Auth) ───────────────
  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: email.toLowerCase() })
      .getOne();
  }
}
