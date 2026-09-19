import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export interface JwtPayload {
  sub: string;      // user ID
  email: string;
  role: string;
  adminLevel: string | null;
}

/**
 * JwtStrategy — valide le token JWT et injecte l'utilisateur dans request.user.
 * Implémente le principe DIP : dépend de l'abstraction PassportStrategy.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev-secret-change-me',
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || user.status === 'suspendu') {
      throw new UnauthorizedException('Compte suspendu ou introuvable.');
    }

    return user;
  }
}
