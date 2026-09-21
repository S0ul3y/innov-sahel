/**
 * Seed — InnovSahel BackEnd
 *
 * Peuples la base de données avec :
 *  1. Les 2 comptes administrateurs IMPACT SAHEL
 *  2. Les 6 communes du District de Bamako
 *
 * Utilisation : npm run seed
 */

import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../modules/users/entities/user.entity';
import { CommuneEntity } from '../modules/communes/entities/commune.entity';
import { InitiativeEntity } from '../modules/initiatives/entities/initiative.entity';
import { PublicationEntity } from '../modules/publications/entities/publication.entity';
import { ContributionEntity } from '../modules/contributions/entities/contribution.entity';
import { CommentEntity } from '../modules/comments/entities/comment.entity';
import { Role } from '../common/enums/role.enum';

const ALL_ENTITIES = [
  UserEntity,
  CommuneEntity,
  InitiativeEntity,
  PublicationEntity,
  ContributionEntity,
  CommentEntity,
];

// ─── Configuration DataSource pour le seed ────────────────────────────────────
const dbType = process.env.DB_TYPE || 'mysql';

const AppDataSource =
  dbType === 'mysql'
    ? new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
        database: process.env.DB_DATABASE || 'innovsahel_db',
        charset: 'utf8mb4_unicode_ci',
        entities: ALL_ENTITIES,
        synchronize: true,
      })
    : new DataSource({
        type: 'sqljs',
        location: process.env.DB_DATABASE || './innovsahel.db',
        autoSave: true,
        entities: ALL_ENTITIES,
        synchronize: true,
      } as any);

// ─── Données des 6 communes du District de Bamako ───────────────────────────
const COMMUNES_DATA = [
  {
    id: 'c1',
    name: 'Commune I',
    district: 'District de Bamako',
    neighborhoods: ['Korofina', 'Djelibougou', 'Bankoni', 'Boulkassoumbougou', 'Sibiribougou'],
    population: '280 000',
    superficie: '34 km²',
    description: 'Commune I, la plus peuplée, est un carrefour économique et culturel du nord de Bamako.',
    mayor: 'Mamadou Coulibaly',
    mayorTeam: 'Conseil Municipal de la Commune I',
    townHallAddress: 'Avenue de la Nation, Bamako',
    townHallPhone: '+223 20 21 11 11',
    townHallEmail: 'mairie.commune1@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Urbanisme', 'Voirie', 'Hygiène'],
    coordinates: { lat: 12.665, lng: -8.002 },
  },
  {
    id: 'c2',
    name: 'Commune II',
    district: 'District de Bamako',
    neighborhoods: ['Badialan', 'Hippodrome', 'Médina Coura', 'Quinzambougou', 'TSF'],
    population: '135 000',
    superficie: '17 km²',
    description: 'Commune II abrite le quartier historique de Médina Coura et de nombreux commerces.',
    mayor: 'Ibrahim Traoré',
    mayorTeam: 'Conseil Municipal de la Commune II',
    townHallAddress: 'Rue 223, Badialan II, Bamako',
    townHallPhone: '+223 20 22 22 22',
    townHallEmail: 'mairie.commune2@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Commerce', 'Marché central'],
    coordinates: { lat: 12.650, lng: -7.995 },
  },
  {
    id: 'c3',
    name: 'Commune III',
    district: 'District de Bamako',
    neighborhoods: ['Wolofobougou', 'Missabougou', 'Niamakoro', 'Garantibougou'],
    population: '155 000',
    superficie: '28 km²',
    description: 'Commune III est une commune résidentielle en expansion rapide à l\'est de Bamako.',
    mayor: 'Fatoumata Diallo',
    mayorTeam: 'Conseil Municipal de la Commune III',
    townHallAddress: 'Rue de Niamakoro, Commune III, Bamako',
    townHallPhone: '+223 20 33 33 33',
    townHallEmail: 'mairie.commune3@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Urbanisme', 'Éducation'],
    coordinates: { lat: 12.640, lng: -7.978 },
  },
  {
    id: 'c4',
    name: 'Commune IV',
    district: 'District de Bamako',
    neighborhoods: ['Lafiabougou', 'Hamdallaye', 'Djicoroni', 'Sébénikoro', 'Kalaban Coura'],
    population: '350 000',
    superficie: '37 km²',
    description: 'Commune IV est la plus étendue du District, avec des quartiers populaires et résidentiels.',
    mayor: 'Oumar Bah',
    mayorTeam: 'Conseil Municipal de la Commune IV',
    townHallAddress: 'Hamdallaye ACI 2000, Bamako',
    townHallPhone: '+223 20 44 44 44',
    townHallEmail: 'mairie.commune4@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Voirie', 'Hydraulique'],
    coordinates: { lat: 12.625, lng: -8.020 },
  },
  {
    id: 'c5',
    name: 'Commune V',
    district: 'District de Bamako',
    neighborhoods: ['Badalabougou', 'Faladié', 'Magnambougou', 'Sabalibougou'],
    population: '195 000',
    superficie: '28 km²',
    description: 'Commune V accueille l\'Université de Bamako et de nombreux établissements académiques.',
    mayor: 'Awa Keïta',
    mayorTeam: 'Conseil Municipal de la Commune V',
    townHallAddress: 'Badalabougou, Commune V, Bamako',
    townHallPhone: '+223 20 55 55 55',
    townHallEmail: 'mairie.commune5@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Éducation', 'Culture', 'Sport'],
    coordinates: { lat: 12.619, lng: -7.990 },
  },
  {
    id: 'c6',
    name: 'Commune VI',
    district: 'District de Bamako',
    neighborhoods: ['Sogoniko', 'Yirimadio', 'Dianéguéla', 'Banankabougou', 'Missabougou'],
    population: '220 000',
    superficie: '32 km²',
    description: 'Commune VI est une commune en pleine croissance à la périphérie sud-est de Bamako.',
    mayor: 'Cheick Konaté',
    mayorTeam: 'Conseil Municipal de la Commune VI',
    townHallAddress: 'Sogoniko, Commune VI, Bamako',
    townHallPhone: '+223 20 66 66 66',
    townHallEmail: 'mairie.commune6@bamako.gov.ml',
    openingHours: 'Lundi – Vendredi : 7h30 – 16h30',
    services: ['État civil', 'Urbanisme', 'Transport'],
    coordinates: { lat: 12.610, lng: -7.960 },
  },
];

async function seed() {
  console.log('\n🌱 InnovSahel — Démarrage du seed...\n');

  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(UserEntity);
  const communeRepo = AppDataSource.getRepository(CommuneEntity);

  // ─── 1. Communes ───────────────────────────────────────────────────────────
  console.log('📍 Seed des communes...');
  for (const data of COMMUNES_DATA) {
    const existing = await communeRepo.findOne({ where: { id: data.id } });
    if (!existing) {
      await communeRepo.save(communeRepo.create(data));
      console.log(`   ✓ ${data.name} créée`);
    } else {
      console.log(`   — ${data.name} déjà existante`);
    }
  }

  // ─── 2. Admins ──────────────────────────────────────────────────────────────
  console.log('\n👤 Seed des administrateurs...');

  const admins = [
    {
      name: process.env.ADMIN_1_NAME || 'Moussa Cissé',
      email: (process.env.ADMIN_1_EMAIL || 'moussa.cisse@impactsahel.org').toLowerCase(),
      phone: process.env.ADMIN_1_PHONE || '+223 20 23 45 67',
      password: process.env.ADMIN_1_PASSWORD || 'Admin1_TempPass2025!',
      role: Role.SUPER_ADMIN,
      label: 'Super Admin',
    },
    {
      name: process.env.ADMIN_2_NAME || 'Aminata Traoré',
      email: (process.env.ADMIN_2_EMAIL || 'aminata.traore@impactsahel.org').toLowerCase(),
      phone: process.env.ADMIN_2_PHONE || '+223 70 12 34 56',
      password: process.env.ADMIN_2_PASSWORD || 'Admin2_TempPass2025!',
      role: Role.ADMIN,
      label: 'Admin Platform',
    },
  ];

  for (const admin of admins) {
    const existing = await userRepo.findOne({ where: { email: admin.email } });
    if (!existing) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(admin.password, salt);
      await userRepo.save(
        userRepo.create({
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          password: hashedPassword,
          role: admin.role,
          adminLevel: null,
          status: 'actif',
          mustChangePassword: false,
        }),
      );
      console.log(`   ✓ ${admin.name} (${admin.label}) créé(e)`);
    } else {
      existing.role = admin.role;
      existing.adminLevel = null;
      await userRepo.save(existing);
      console.log(`   ✓ ${admin.name} mis à jour avec le rôle ${admin.role}`);
    }
  }

  // ─── 3. Porteur par défaut ───────────────────────────────────────────────────
  console.log('\n🌱 Seed du porteur d\'initiative par défaut...');

  const porteurEmail = (process.env.PORTEUR_1_EMAIL || 'fatoumata.diallo@labcitoyen.org').toLowerCase();
  const existingPorteur = await userRepo.findOne({ where: { email: porteurEmail } });
  if (!existingPorteur) {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(
      process.env.PORTEUR_1_PASSWORD || 'Porteur1_TempPass2025!',
      salt,
    );
    await userRepo.save(
      userRepo.create({
        name: process.env.PORTEUR_1_NAME || 'Fatoumata Diallo',
        email: porteurEmail,
        phone: process.env.PORTEUR_1_PHONE || '+223 76 98 76 54',
        password: hashedPassword,
        role: Role.PORTEUR,
        adminLevel: null,
        communeId: 'c4',
        initiativeName: 'Jardins Partagés de Hamdallaye',
        status: 'actif',
        mustChangePassword: true,
      }),
    );
    console.log('   ✓ Fatoumata Diallo (Porteur par défaut) créée');
  } else {
    console.log('   — Fatoumata Diallo déjà existante');
  }

  await AppDataSource.destroy();
  console.log('\n✅ Seed terminé avec succès !\n');
  console.log('🔑 Identifiants Super Admin (Moussa Cissé) :');
  console.log(`   Email    : ${admins[0].email}`);
  console.log(`   Password : ${process.env.ADMIN_1_PASSWORD || 'Admin1_TempPass2025!'}`);
  console.log('\n🔑 Identifiants Admin Platform (Aminata Traoré) :');
  console.log(`   Email    : ${admins[1].email}`);
  console.log(`   Password : ${process.env.ADMIN_2_PASSWORD || 'Admin2_TempPass2025!'}`);
  console.log('\n🔑 Identifiants Porteur (Fatoumata Diallo) :');
  console.log(`   Email    : ${porteurEmail}`);
  console.log(`   Password : ${process.env.PORTEUR_1_PASSWORD || 'Porteur1_TempPass2025!'}\n`);
}

seed().catch((err) => {
  console.error('❌ Erreur lors du seed :', err);
  process.exit(1);
});
