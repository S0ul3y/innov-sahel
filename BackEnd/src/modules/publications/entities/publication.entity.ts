import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommuneEntity } from '../../communes/entities/commune.entity';
import { InitiativeEntity } from '../../initiatives/entities/initiative.entity';

export type PublicationType = 'commune_news' | 'initiative_update' | 'activity';
export type PublicationFormat = 'carousel' | 'video';
export type PublicationStatus = 'draft' | 'published';

@Entity('publications')
export class PublicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: ['commune_news', 'initiative_update', 'activity'] })
  type: PublicationType;

  @Column({ type: 'simple-enum', enum: ['carousel', 'video'], default: 'carousel' })
  format: PublicationFormat;

  // Auteur de la publication (FK → users)
  @Column({ nullable: true })
  authorUserId: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'authorUserId' })
  authorUser: UserEntity;

  @Column()
  authorName: string;

  @Column({ type: 'simple-enum', enum: ['admin', 'porteur'] })
  authorRole: 'admin' | 'porteur';

  // Initiative associée (nullable — seulement pour les publications d'initiative)
  @Column({ nullable: true })
  initiativeId: string;

  @ManyToOne(() => InitiativeEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'initiativeId' })
  initiative: InitiativeEntity;

  // Commune obligatoire (§5.1 du cahier des charges)
  @Column()
  communeId: string;

  @ManyToOne(() => CommuneEntity, { nullable: false })
  @JoinColumn({ name: 'communeId' })
  commune: CommuneEntity;

  @Column()
  title: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'simple-json', nullable: true })
  carouselImages: Array<{ url: string; caption?: string }>;

  @Column({ nullable: true })
  youtubeUrl: string;

  @Column({ nullable: true })
  youtubeId: string;

  @Column({ type: 'simple-enum', enum: ['draft', 'published'], default: 'published' })
  publicationStatus: PublicationStatus;

  @Column({ nullable: true })
  date: string;

  @Column({ default: 0 })
  viewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
