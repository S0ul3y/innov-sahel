import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CommuneEntity } from '../../communes/entities/commune.entity';

export type InitiativeStatus = 'demarre' | 'en_cours' | 'termine';
export type OwnerType = 'jeune' | 'femme' | 'collectif';

@Entity('initiatives')
export class InitiativeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // Porteur propriétaire (FK → users)
  @Column({ nullable: true })
  ownerUserId: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerUserId' })
  ownerUser: UserEntity;

  @Column()
  ownerName: string;

  @Column({ type: 'simple-enum', enum: ['jeune', 'femme', 'collectif'], default: 'jeune' })
  ownerType: OwnerType;

  @Column({ type: 'text', nullable: true })
  ownerBio: string;

  @Column({ nullable: true })
  ownerAvatar: string;

  // Commune de réalisation (FK → communes) — OBLIGATOIRE
  @Column()
  communeId: string;

  @ManyToOne(() => CommuneEntity, { nullable: false })
  @JoinColumn({ name: 'communeId' })
  commune: CommuneEntity;

  @Column()
  domain: string;

  @Column({ type: 'text' })
  problem: string;

  @Column({ type: 'text' })
  solution: string;

  @Column({ type: 'text', nullable: true })
  beneficiaries: string;

  @Column({ nullable: true })
  startDate: string;

  @Column({ type: 'simple-enum', enum: ['demarre', 'en_cours', 'termine'], default: 'demarre' })
  status: InitiativeStatus;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ type: 'simple-json', nullable: true })
  gallery: Array<{ url: string; caption?: string }>;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ nullable: true })
  videoUrl: string;

  // visible (true) ou masquée par l'admin (false)
  @Column({ default: true })
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
