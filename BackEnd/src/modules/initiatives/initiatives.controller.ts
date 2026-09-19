import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../users/entities/user.entity';

@ApiTags('Initiatives')
@Controller('initiatives')
export class InitiativesController {
  constructor(private readonly svc: InitiativesService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les initiatives [PUBLIC]' })
  @ApiQuery({ name: 'communeId', required: false })
  findAll(@Query('communeId') communeId?: string) {
    return this.svc.findAll(communeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une initiative [PUBLIC]' })
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Créer une initiative [PORTEUR ou ADMIN]' })
  create(@Body() dto: CreateInitiativeDto, @CurrentUser() user: UserEntity) {
    return this.svc.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Modifier une initiative [PORTEUR propriétaire ou ADMIN]' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInitiativeDto,
    @CurrentUser() user: UserEntity,
  ) { return this.svc.update(id, dto, user); }

  @Patch(':id/visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Masquer / afficher une initiative [ADMIN]' })
  toggleVisibility(@Param('id') id: string) {
    return this.svc.toggleVisibility(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer une initiative [ADMIN]' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
