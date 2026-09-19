import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../users/entities/user.entity';
import { IsEnum } from 'class-validator';
import { PublicationStatus } from './entities/publication.entity';

@ApiTags('Publications')
@Controller('publications')
export class PublicationsController {
  constructor(private readonly svc: PublicationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les publications publiées [PUBLIC]' })
  @ApiQuery({ name: 'communeId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'initiativeId', required: false })
  findAll(
    @Query('communeId') communeId?: string,
    @Query('type') type?: string,
    @Query('initiativeId') initiativeId?: string,
  ) {
    return this.svc.findAll({ communeId, type, initiativeId });
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lister toutes publications y compris brouillons [ADMIN]' })
  findAllAdmin(@Query('communeId') communeId?: string, @Query('type') type?: string) {
    return this.svc.findAllAdmin({ communeId, type });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une publication [PUBLIC]' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une publication [PORTEUR ou ADMIN]' })
  create(@Body() dto: CreatePublicationDto, @CurrentUser() user: UserEntity) {
    return this.svc.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier une publication [PORTEUR propriétaire ou ADMIN]' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePublicationDto,
    @CurrentUser() user: UserEntity,
  ) { return this.svc.update(id, dto, user); }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Masquer ou publier une publication [ADMIN]' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: PublicationStatus,
  ) { return this.svc.updateStatus(id, status); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer une publication [ADMIN]' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
