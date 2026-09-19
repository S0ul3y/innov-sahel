import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — protège les routes nécessitant un token JWT valide.
 *
 * Utilisation : @UseGuards(JwtAuthGuard)
 * Si le token est absent ou invalide → 401 Unauthorized
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
