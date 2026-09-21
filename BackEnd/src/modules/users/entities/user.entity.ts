import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role, AdminLevel } from '../../../common/enums/role.enum';

/**
 * UserEntity — Modèle de données utilisateur InnovSahel.
 *
 * Deux rôles :
 *   - admin   : Administrateur IMPACT SAHEL (adminLevel: principal | suivi)
 *   - porteur : Porteur d'initiative (jeune ou femme Lab'Citoyen)
 *
 * Les porteurs n'ont jamais d'adminLevel (null).
 */
@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 'uuid-v4' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Moussa Cissé' })
  @Column()
  name: string;

  @ApiProperty({ example: 'moussa.cisse@impactsahel.org' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '+223 20 23 45 67' })
  @Column({ nullable: true })
  phone: string;

  // Mot de passe haché (bcrypt) — jamais exposé dans les réponses API
  @Column({ select: false })
  password: string;

  @ApiProperty({ enum: Role, example: Role.ADMIN })
  @Column({ type: 'simple-enum', enum: ['super_admin', 'admin', 'porteur'] })
  role: Role;


  /**
   * Niveau d'administration (null pour les porteurs).
   * - principal → Admin 1 (Moussa Cissé) : accès total
   * - suivi     → Admin 2 (Aminata Traoré) : lecture + modération
   */
  @ApiProperty({ enum: AdminLevel, nullable: true, example: AdminLevel.PRINCIPAL })
  @Column({ type: 'simple-enum', enum: AdminLevel, nullable: true, default: null })
  adminLevel: AdminLevel | null;

  // Commune associée (pour les porteurs uniquement)
  @Column({ nullable: true })
  communeId: string;

  // Nom de l'initiative principale du porteur
  @Column({ nullable: true })
  initiativeName: string;

  @ApiProperty({ enum: ['actif', 'suspendu'], example: 'actif' })
  @Column({ default: 'actif' })
  status: 'actif' | 'suspendu';

  // Forcer le changement de mot de passe à la prochaine connexion
  @Column({ default: false })
  mustChangePassword: boolean;

  @Column({ nullable: true })
  lastLogin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
