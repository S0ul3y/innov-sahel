import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, ReplyCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../users/entities/user.entity';
import { Request } from 'express';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly svc: CommentsService) {}

  @Get('publication/:publicationId')
  @ApiOperation({ summary: 'Commentaires d\'une publication [PUBLIC]' })
  findByPublication(@Param('publicationId') id: string) {
    return this.svc.findByPublication(id);
  }

  @Get('initiative/:initiativeId')
  @ApiOperation({ summary: 'Commentaires d\'une initiative [PUBLIC]' })
  findByInitiative(@Param('initiativeId') id: string) {
    return this.svc.findByInitiative(id);
  }

  @Get('reported')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Commentaires signalés [ADMIN]' })
  findReported() { return this.svc.findReported(); }

  // PUBLIC — Ouvert à tous (sans compte)
  @Post()
  @ApiOperation({ summary: 'Poster un commentaire [PUBLIC — sans compte]' })
  create(@Body() dto: CreateCommentDto, @Req() req: Request) {
    const clientIp = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
    return this.svc.create(dto, clientIp);
  }

  @Post(':id/report')
  @ApiOperation({ summary: 'Signaler un commentaire [PUBLIC]' })
  report(@Param('id') id: string) { return this.svc.report(id); }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PORTEUR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Répondre à un commentaire [PORTEUR ou ADMIN]' })
  reply(
    @Param('id') id: string,
    @Body() dto: ReplyCommentDto,
    @CurrentUser() user: UserEntity,
  ) { return this.svc.reply(id, dto, user.name); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Supprimer un commentaire [ADMIN]' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
