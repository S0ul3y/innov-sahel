import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminLevelGuard } from '../../common/guards/admin-level.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireAdminLevel } from '../../common/decorators/admin-level.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, AdminLevel } from '../../common/enums/role.enum';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── GET /api/users ── Liste porteurs [ADMIN] ─────────────────────────────
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lister tous les porteurs [ADMIN]' })
  findAll() {
    return this.usersService.findAllPorteurs();
  }

  // ─── POST /api/users ── Créer porteur [ADMIN PRINCIPAL] ──────────────────
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(AdminLevelGuard)
  @RequireAdminLevel(AdminLevel.PRINCIPAL)
  @ApiOperation({ summary: 'Créer un compte porteur [Admin Principal uniquement]' })
  @ApiResponse({ status: 201, description: 'Compte porteur créé' })
  @ApiResponse({ status: 403, description: "Réservé à l'Admin Principal" })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createPorteur(dto);
  }

  // ─── GET /api/users/:id ── Détail compte ─────────────────────────────────
  @Get(':id')
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiOperation({ summary: "Détail d'un compte utilisateur [ADMIN ou propriétaire]" })
  findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    // Un porteur ne peut voir que son propre profil
    if (user.role === Role.PORTEUR && user.id !== id) {
      return this.usersService.findOne(user.id);
    }
    return this.usersService.findOne(id);
  }

  // ─── PATCH /api/users/:id ── Modifier compte ──────────────────────────────
  @Patch(':id')
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiOperation({ summary: 'Modifier un compte [ADMIN ou propriétaire]' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.usersService.update(id, dto, user);
  }

  // ─── DELETE /api/users/:id ── Supprimer porteur [ADMIN PRINCIPAL] ─────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(AdminLevelGuard)
  @RequireAdminLevel(AdminLevel.PRINCIPAL)
  @ApiOperation({ summary: 'Supprimer un compte porteur [Admin Principal uniquement]' })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  @ApiResponse({ status: 403, description: "Réservé à l'Admin Principal" })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ─── PATCH /api/users/:id/status ── Activer/Suspendre [ADMIN PRINCIPAL] ───
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @UseGuards(AdminLevelGuard)
  @RequireAdminLevel(AdminLevel.PRINCIPAL)
  @ApiOperation({ summary: 'Activer ou suspendre un porteur [Admin Principal uniquement]' })
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(id);
  }
}
