import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../common/enums/role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { generateSecurePassword } from '../../common/utils/password.utils';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ─── Créer un porteur (Super Admin ou Admin) ─────────────────────────────────
  async createPorteur(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Un compte avec cet email existe déjà.');
    }

    // Proposer le mot de passe reçu (modifiable) ou en générer un par défaut
    const plainPassword =
      dto.temporaryPassword && dto.temporaryPassword.trim().length >= 6
        ? dto.temporaryPassword.trim()
        : generateSecurePassword();

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

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
      mustChangePassword: true,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`Porteur créé et enregistré en base de données : ${saved.name} (${saved.email})`);

    // Envoyer l'email de bienvenue avec les identifiants
    this.notificationsService
      .sendPorteurWelcome(saved.email, saved.name, plainPassword)
      .catch((err) => {
        this.logger.warn(`Erreur lors de l'envoi d'email au porteur ${saved.email}: ${err?.message}`);
      });

    const { password, ...result } = saved;
    return result;
  }

  // ─── Créer un Admin Platform (Super Admin seulement) ─────────────────────────
  async createAdmin(dto: CreateAdminDto): Promise<Omit<UserEntity, 'password'>> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Un compte avec cet email existe déjà.');
    }

    // Proposer le mot de passe reçu (modifiable) ou en générer un par défaut
    const plainPassword =
      dto.temporaryPassword && dto.temporaryPassword.trim().length >= 6
        ? dto.temporaryPassword.trim()
        : generateSecurePassword();

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      password: hashedPassword,
      role: Role.ADMIN,
      adminLevel: null,
      status: 'actif',
      mustChangePassword: true,
    });

    const saved = await this.userRepository.save(user);
    this.logger.log(`Admin créé et enregistré en base de données : ${saved.name} (${saved.email})`);

    // Envoyer l'email de bienvenue avec les identifiants
    this.notificationsService
      .sendAdminWelcome(saved.email, saved.name, plainPassword)
      .catch((err) => {
        this.logger.warn(`Erreur lors de l'envoi d'email à l'admin ${saved.email}: ${err?.message}`);
      });

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

  // ─── Lister tous les admins platform (Super Admin seulement) ─────────────────
  async findAllAdmins(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await this.userRepository.find({
      where: { role: Role.ADMIN },
      order: { createdAt: 'DESC' },
    });
    return users.map(({ password, ...u }) => u);
  }

  // ─── Lister tous les utilisateurs ───────────────────────────────────────────
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

    // Un admin ne peut pas modifier un super_admin
    if (requestingUser.role === Role.ADMIN && user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Impossible de modifier le Super Administrateur.');
    }

    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  // ─── Supprimer un compte porteur ─────────────────────────────────────────────
  async remove(id: string, requestingUser: UserEntity): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    if (user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Impossible de supprimer le Super Administrateur.');
    }

    // Un admin ne peut supprimer que les porteurs (pas d'autres admins)
    if (requestingUser.role === Role.ADMIN && user.role === Role.ADMIN) {
      throw new ForbiddenException(
        'Seul le Super Administrateur peut supprimer un compte admin.',
      );
    }

    await this.userRepository.remove(user);
    return { message: `Le compte de "${user.name}" a été définitivement supprimé.` };
  }

  // ─── Activer / Désactiver un compte ──────────────────────────────────────────
  async toggleStatus(
    id: string,
    requestingUser: UserEntity,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    // Protéger le Super Admin
    if (user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('Impossible de désactiver le Super Administrateur.');
    }

    // Un admin ne peut désactiver que les porteurs, pas les autres admins
    if (requestingUser.role === Role.ADMIN && user.role === Role.ADMIN) {
      throw new ForbiddenException(
        'Seul le Super Administrateur peut activer/désactiver un compte admin.',
      );
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
