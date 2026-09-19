import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { PublicationEntity } from '../../publications/entities/publication.entity';
import { InitiativeEntity } from '../../initiatives/entities/initiative.entity';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Rattaché à une publication OU une initiative (pas les deux à la fois)
  @Column({ nullable: true })
  publicationId: string;

  @ManyToOne(() => PublicationEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'publicationId' })
  publication: PublicationEntity;

  @Column({ nullable: true })
  initiativeId: string;

  @ManyToOne(() => InitiativeEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'initiativeId' })
  initiative: InitiativeEntity;

  // Pseudonyme public — pas de compte requis (§7.2 cahier des charges)
  @Column()
  authorName: string;

  @Column({ type: 'simple-enum', enum: ['citoyen', 'porteur', 'admin'], default: 'citoyen' })
  authorRole: 'citoyen' | 'porteur' | 'admin';

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  reported: boolean;

  // Réponse de l'auteur de la publication / admin
  @Column({ nullable: true })
  parentCommentId: string;

  @Column({ type: 'text', nullable: true })
  replyText: string;

  // Protection anti-abus : IP hashée (jamais stockée en clair — §10.2)
  @Column({ nullable: true, select: false })
  ipHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
