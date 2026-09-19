import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommunesService } from './communes.service';
import { UpdateCommuneDto } from './dto/update-commune.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminLevelGuard } from '../../common/guards/admin-level.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequireAdminLevel } from '../../common/decorators/admin-level.decorator';
import { Role, AdminLevel } from '../../common/enums/role.enum';

@ApiTags('Communes')
@Controller('communes')
export class CommunesController {
  constructor(private readonly communesService: CommunesService) {}

  // PUBLIC — Pas de token requis
  @Get()
  @ApiOperation({ summary: 'Lister les 6 communes [PUBLIC]' })
  findAll() { return this.communesService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une commune [PUBLIC]" })
  findOne(@Param('id') id: string) { return this.communesService.findOne(id); }

  // ADMIN PRINCIPAL seulement
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, AdminLevelGuard)
  @Roles(Role.ADMIN)
  @RequireAdminLevel(AdminLevel.PRINCIPAL)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier une fiche commune [Admin Principal uniquement]' })
  update(@Param('id') id: string, @Body() dto: UpdateCommuneDto) {
    return this.communesService.update(id, dto);
  }
}
