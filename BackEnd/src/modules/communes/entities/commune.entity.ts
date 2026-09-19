import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CommuneEntity — Les 6 communes du District de Bamako.
 *
 * Les IDs fixes ('c1' → 'c6') correspondent aux IDs du frontend.
 * Les communes sont seeded au démarrage et ne sont jamais créées via API.
 * Seul l'Admin Principal peut modifier leurs informations.
 */
@Entity('communes')
export class CommuneEntity {
  @PrimaryColumn()
  id: string; // 'c1' à 'c6'

  @Column()
  name: string; // 'Commune I'

  @Column({ default: 'District de Bamako' })
  district: string;

  // Stocké en JSON (SQLite : simple-json ; PostgreSQL : jsonb)
  @Column({ type: 'simple-json', nullable: true })
  neighborhoods: string[];

  @Column({ nullable: true })
  population: string;

  @Column({ nullable: true })
  superficie: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  mayor: string;

  @Column({ nullable: true })
  mayorTeam: string;

  @Column({ nullable: true })
  townHallAddress: string;

  @Column({ nullable: true })
  townHallPhone: string;

  @Column({ nullable: true })
  townHallEmail: string;

  @Column({ nullable: true })
  openingHours: string;

  @Column({ type: 'simple-json', nullable: true })
  services: string[];

  @Column({ type: 'simple-json', nullable: true })
  socialLinks: { facebook?: string; twitter?: string; website?: string } | null;

  @Column({ nullable: true })
  whatsappChannelUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  coordinates: { lat: number; lng: number };

  @UpdateDateColumn()
  updatedAt: Date;
}
