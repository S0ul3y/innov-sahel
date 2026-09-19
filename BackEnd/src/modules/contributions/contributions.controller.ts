import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiProduces } from '@nestjs/swagger';
import { Response } from 'express';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionStatusDto } from './dto/update-contribution-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('Contributions')
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly svc: ContributionsService) {}

  // PUBLIC — Soumettre une idée ou un signalement (sans compte)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soumettre une idée ou un signalement [PUBLIC — sans compte]' })
  create(@Body() dto: CreateContributionDto) {
    return this.svc.create(dto);
  }

  // ADMIN — Voir toutes les contributions
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lister toutes les contributions [ADMIN]' })
  @ApiQuery({ name: 'type', required: false, enum: ['idee', 'signalement'] })
  @ApiQuery({ name: 'communeId', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('type') type?: string,
    @Query('communeId') communeId?: string,
    @Query('status') status?: string,
  ) { return this.svc.findAll({ type, communeId, status }); }

  // ADMIN — Export CSV
  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Exporter les contributions en CSV [ADMIN]' })
  @ApiProduces('text/csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.svc.exportCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="contributions-innovsahel-${new Date().toISOString().slice(0, 10)}.csv"`,
    );
    res.send('\uFEFF' + csv); // BOM pour compatibilité Excel
  }

  // ADMIN — Détail
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Détail d\'une contribution [ADMIN]' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  // ADMIN — Mettre à jour le statut
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Changer le statut d\'une contribution [ADMIN]' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateContributionStatusDto) {
    return this.svc.updateStatus(id, dto);
  }

  // ADMIN — Supprimer
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer une contribution [ADMIN]' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
