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
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { SuperAdminGuard } from '../../common/guards/super-admin.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── GET /api/users/admins ── Liste des admins platform [SUPER_ADMIN] ────────
  @Get('admins')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Lister les admins platform [Super Admin uniquement]' })
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  // ─── POST /api/users/admin ── Créer un admin platform [SUPER_ADMIN] ──────────
  @Post('admin')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Créer un compte Admin Platform [Super Admin uniquement]' })
  @ApiResponse({ status: 201, description: 'Compte admin créé' })
  @ApiResponse({ status: 403, description: 'Réservé au Super Administrateur' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(dto);
  }

  // ─── GET /api/users ── Liste porteurs [ADMIN ou SUPER_ADMIN] ─────────────────
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lister tous les porteurs [ADMIN]' })
  findAll() {
    return this.usersService.findAllPorteurs();
  }

  // ─── POST /api/users ── Créer porteur [ADMIN ou SUPER_ADMIN] ─────────────────
  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer un compte porteur [Admin ou Super Admin]' })
  @ApiResponse({ status: 201, description: 'Compte porteur créé' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createPorteur(dto);
  }

  // ─── GET /api/users/:id ── Détail compte ─────────────────────────────────────
  @Get(':id')
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiOperation({ summary: "Détail d'un compte utilisateur [ADMIN ou propriétaire]" })
  findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    if (user.role === Role.PORTEUR && user.id !== id) {
      return this.usersService.findOne(user.id);
    }
    return this.usersService.findOne(id);
  }

  // ─── PATCH /api/users/:id ── Modifier compte ──────────────────────────────────
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

  // ─── DELETE /api/users/:id ── Supprimer compte ────────────────────────────────
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un compte porteur [Admin ou Super Admin]' })
  @ApiResponse({ status: 200, description: 'Compte supprimé' })
  remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.usersService.remove(id, user);
  }

  // ─── PATCH /api/users/:id/status ── Activer/Désactiver ────────────────────────
  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Activer ou désactiver un compte [selon hiérarchie]' })
  toggleStatus(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.usersService.toggleStatus(id, user);
  }
}
