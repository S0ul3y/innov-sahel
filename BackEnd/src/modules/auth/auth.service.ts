import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/change-password.dto';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  // ─── Connexion ──────────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('LOWER(user.email) = LOWER(:email)', { email: dto.email.trim() })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    if (user.status === 'suspendu') {
      throw new UnauthorizedException(
        'Votre compte a été suspendu. Contactez un administrateur.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // Mise à jour de la dernière connexion
    await this.userRepository.update(user.id, {
      lastLogin: new Date().toISOString(),
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      adminLevel: user.adminLevel,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConfig.refreshSecret,
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        adminLevel: user.adminLevel,
        communeId: user.communeId,
        initiativeName: user.initiativeName,
      },
    };
  }

  // ─── Rafraîchissement du token ──────────────────────────────────────────────
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.refreshSecret,
      });

      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user || user.status === 'suspendu') {
        throw new UnauthorizedException();
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        adminLevel: user.adminLevel,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch {
      throw new UnauthorizedException('Token de rafraîchissement invalide ou expiré.');
    }
  }

  // ─── Changement de mot de passe (auto) ─────────────────────────────────────
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mot de passe actuel incorrect.');
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userRepository.update(userId, {
      password: hashedPassword,
      mustChangePassword: false,
    });

    return { message: 'Mot de passe mis à jour avec succès.' };
  }

  // ─── Réinitialisation de mot de passe (par Admin Principal) ─────────────────
  async resetPassword(targetUserId: string, dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userRepository.update(targetUserId, {
      password: hashedPassword,
      mustChangePassword: true, // Force le changement à la prochaine connexion
    });

    return { message: `Mot de passe de ${user.name} réinitialisé. L'utilisateur devra le changer à sa prochaine connexion.` };
  }

  // ─── Récupération du profil (vérification token) ─────────────────────────
  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const { password, ...profile } = user;
    return profile;
  }
}
