import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto, ResetPasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminLevelGuard } from '../../common/guards/admin-level.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireAdminLevel } from '../../common/decorators/admin-level.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, AdminLevel } from '../../common/enums/role.enum';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /api/auth/login ─────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion (Admin ou Porteur)' })
  @ApiResponse({ status: 200, description: 'Connexion réussie, retourne les tokens JWT' })
  @ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── POST /api/auth/refresh ───────────────────────────────────────────────
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rafraîchir le token d'accès" })
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  // ─── GET /api/auth/me ─────────────────────────────────────────────────────
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Profil retourné' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  getProfile(@CurrentUser() user: UserEntity) {
    return this.authService.getProfile(user.id);
  }

  // ─── POST /api/auth/change-password ──────────────────────────────────────
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Changer son propre mot de passe' })
  changePassword(
    @CurrentUser() user: UserEntity,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.id, dto);
  }

  // ─── POST /api/auth/reset-password/:id ───────────────────────────────────
  // Réservé à l'Admin Principal — réinitialise le mot de passe d'un porteur
  @Post('reset-password/:id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminLevelGuard)
  @Roles(Role.ADMIN)
  @RequireAdminLevel(AdminLevel.PRINCIPAL)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Réinitialiser le mot de passe d'un porteur [Admin Principal uniquement]",
  })
  @ApiResponse({ status: 200, description: 'Mot de passe réinitialisé' })
  @ApiResponse({ status: 403, description: "Réservé à l'Admin Principal" })
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(id, dto);
  }
}
