import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { CommuneEntity } from '../../communes/entities/commune.entity';

export type ContributionType = 'idee' | 'signalement';
export type ContributionStatus = 'nouveau' | 'vu' | 'transmis' | 'cloture';

/**
 * CitizenContributionEntity — Idées et signalements soumis par les citoyens.
 *
 * Règles clés (§7.3 / §7.4 / §7.5 cahier des charges) :
 *  - Soumis sans compte (PUBLIC)
 *  - Jamais affichés publiquement
 *  - Coordonnées citoyennes facultatives et confidentielles
 *  - Déclenchent un email aux admins à la réception
 */
@Entity('citizen_contributions')
export class ContributionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-enum', enum: ['idee', 'signalement'] })
  type: ContributionType;

  // Commune concernée — OBLIGATOIRE
  @Column()
  communeId: string;

  @ManyToOne(() => CommuneEntity, { nullable: false })
  @JoinColumn({ name: 'communeId' })
  commune: CommuneEntity;

  @Column()
  category: string;

  @Column({ type: 'text' })
  description: string;

  // Photo facultative (URL de l'upload)
  @Column({ nullable: true })
  photoUrl: string;

  // Lieu en texte libre
  @Column({ nullable: true })
  locationText: string;

  // Coordonnées GPS (optionnelles)
  @Column({ type: 'simple-json', nullable: true })
  gpsCoordinates: { lat: number; lng: number } | null;

  // Coordonnées citoyennes facultatives (§10.2 : jamais publiées)
  @Column({ nullable: true, select: false })
  citizenName: string;

  @Column({ nullable: true, select: false })
  citizenPhone: string;

  // Statut interne (visible uniquement par les admins)
  @Column({
    type: 'simple-enum',
    enum: ['nouveau', 'vu', 'transmis', 'cloture'],
    default: 'nouveau',
  })
  internalStatus: ContributionStatus;

  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
