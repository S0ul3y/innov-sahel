import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { CommentEntity } from './entities/comment.entity';
import { CreateCommentDto, ReplyCommentDto } from './dto/create-comment.dto';

// Mots interdits de base (extensible par l'admin via config)
const BANNED_WORDS = ['spam', 'insulte']; // À enrichir selon les besoins IMPACT SAHEL

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly repo: Repository<CommentEntity>,
  ) {}

  async findByPublication(publicationId: string): Promise<CommentEntity[]> {
    return this.repo.find({
      where: { publicationId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByInitiative(initiativeId: string): Promise<CommentEntity[]> {
    return this.repo.find({
      where: { initiativeId },
      order: { createdAt: 'ASC' },
    });
  }

  async findReported(): Promise<CommentEntity[]> {
    return this.repo.find({ where: { reported: true }, order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateCommentDto, clientIp: string): Promise<CommentEntity> {
    if (!dto.publicationId && !dto.initiativeId) {
      throw new BadRequestException('Un commentaire doit être rattaché à une publication ou une initiative.');
    }

    // Filtre anti-mots interdits basique (§7.2 cahier des charges)
    const lowerMsg = dto.message.toLowerCase();
    for (const word of BANNED_WORDS) {
      if (lowerMsg.includes(word)) {
        throw new BadRequestException('Votre message contient un mot interdit.');
      }
    }

    // Hash de l'IP pour anti-abus (jamais stockée en clair — §10.2)
    const ipHash = crypto.createHash('sha256').update(clientIp || 'unknown').digest('hex');

    const comment = this.repo.create({
      ...dto,
      authorRole: 'citoyen',
      ipHash,
    });

    return this.repo.save(comment);
  }

  async report(id: string): Promise<CommentEntity> {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Commentaire introuvable.');
    comment.reported = true;
    return this.repo.save(comment);
  }

  async reply(id: string, dto: ReplyCommentDto, authorName: string): Promise<CommentEntity> {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Commentaire introuvable.');
    comment.replyText = dto.replyText;
    return this.repo.save(comment);
  }

  async remove(id: string): Promise<{ message: string }> {
    const comment = await this.repo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Commentaire introuvable.');
    await this.repo.remove(comment);
    return { message: 'Commentaire supprimé.' };
  }
}
