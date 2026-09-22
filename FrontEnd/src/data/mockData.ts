import { Commune } from '../types';

// â”€â”€â”€ DonnÃ©es statiques des 6 Communes du District de Bamako â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Les communes sont des donnÃ©es fixes/gÃ©ographiques, pas du contenu utilisateur.
// Publications, Initiatives, Commentaires et Contributions viennent exclusivement de la DB.

export const INITIAL_COMMUNES: Commune[] = [
  {
    id: 'c1',
    name: 'Commune I',
    district: 'District de Bamako',
    neighborhoods: ['Korofina Nord', 'Korofina Sud', 'DjÃ©libougou', 'Bankoni', 'Fadjiguila', 'Sotuba', 'Boulkassoumbougou', 'Doumanzana', 'Sikoro'],
    population: '350 000 hab.',
    superficie: '34,2 kmÂ²',
    description: 'SituÃ©e sur la rive gauche du fleuve Niger, la Commune I est un carrefour dynamique regroupant dâ€™importants marchÃ©s, des zones maraÃ®chÃ¨res le long du fleuve et une jeunesse trÃ¨s active dans lâ€™artisanat et les Ã©nergies renouvelables.',
    mayor: 'Oumarou Togo',
    mayorTeam: 'Maire principal assistÃ© de 5 adjoints et de 39 conseillers municipaux.',
    townHallAddress: 'Avenue Al Quds, Korofina Nord, prÃ¨s du Centre de SantÃ© de RÃ©fÃ©rence (CSREF)',
    townHallPhone: '+223 20 24 11 05',
    townHallEmail: 'contact@mairie-commune1-bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00 (Permanence Ã©tat civil le samedi matin)',
    services: [
      'Ã‰tat civil (Naissances, Mariages, DÃ©cÃ¨s, Certificats)',
      'LÃ©galisation de documents & Certifications',
      'Urbanisme, Voirie & Autorisations de construire',
      'HygiÃ¨ne, Assainissement & SalubritÃ© publique',
      'Bureau dâ€™Ã©coute et dâ€™orientation des jeunes'
    ],
    socialLinks: {
      facebook: 'https://facebook.com',
      website: 'https://impactsahel.org'
    },
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune1-bamako',
    coordinates: { lat: 12.6712, lng: -7.9491 }
  },
  {
    id: 'c2',
    name: 'Commune II',
    district: 'District de Bamako',
    neighborhoods: ['Bagadadji', 'Medina-Coura', 'Bozola', 'NiarÃ©la', 'Missira', 'Zone Industrielle', 'Quinzambougou', 'Bakorobabougou'],
    population: '210 000 hab.',
    superficie: '16,8 kmÂ²',
    description: 'CÅ“ur historique et commercial de Bamako, la Commune II abrite le Grand MarchÃ©, le marchÃ© de MÃ©dina-Coura ainsi que de nombreux ateliers dâ€™artisans et fabriques dâ€™Ã©conomie circulaire.',
    mayor: 'Cheick Abba NiarÃ©',
    mayorTeam: 'Conseil municipal composÃ© de 37 membres avec commissions jeunesse et salubritÃ©.',
    townHallAddress: 'Boulevard du Peuple, Quartier Bozola, Face Ã  lâ€™ancienne Grande MosquÃ©e',
    townHallPhone: '+223 20 22 34 88',
    townHallEmail: 'mairie.c2@bamako-sahel.org',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'DÃ©livrance expresse dâ€™actes dâ€™Ã©tat civil',
      'Taxes communales et marchÃ©s',
      'Commission dâ€™assainissement urbain et collecte',
      'Guichet unique dâ€™appui aux femmes commerÃ§antes'
    ],
    socialLinks: {
      facebook: 'https://facebook.com'
    },
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune2-bamako',
    coordinates: { lat: 12.6515, lng: -7.9862 }
  },
  {
    id: 'c3',
    name: 'Commune III',
    district: 'District de Bamako',
    neighborhoods: ['Badialan I, II & III', 'Darsalam', 'Nâ€™Tomikorobougou', 'Bamako-Coura', 'Koulouba', 'Point G', 'Ouolofobougou', 'Sogonafing'],
    population: '160 000 hab.',
    superficie: '23,0 kmÂ²',
    description: 'SiÃ¨ge des institutions rÃ©publicaines (Palais de Koulouba) et de grands centres hospitaliers (Point G), la Commune III se distingue par ses collines verdoyantes et un tissu associatif fÃ©minin remarquable.',
    mayor: 'Mme DjirÃ© Mariam Diallo',
    mayorTeam: 'Bureau communal engagÃ© pour lâ€™autonomisation des femmes et lâ€™accÃ¨s aux soins de proximitÃ©.',
    townHallAddress: 'Rue Nelson Mandela, Darsalam, Bamako',
    townHallPhone: '+223 20 22 45 19',
    townHallEmail: 'contact@commune3-bamako.gov.ml',
    openingHours: 'Lundi au Vendredi : 08h00 - 16h30',
    services: [
      'Ã‰tat civil & Recensement administratif',
      'Service social dâ€™aide aux familles et femmes vulnÃ©rables',
      'Voirie communale et Ã©clairage',
      'Appui aux initiatives Ã©ducatives et artisanales'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune3-bamako',
    coordinates: { lat: 12.6588, lng: -8.0052 }
  },
  {
    id: 'c4',
    name: 'Commune IV',
    district: 'District de Bamako',
    neighborhoods: ['Hamdallaye', 'Lafiabougou', 'Djicoroni-Para', 'SÃ©bÃ©nikoro', 'Taliko', 'Sibiribougou', 'Lassa', 'Kalanban-Coura Ouest'],
    population: '380 000 hab.',
    superficie: '37,6 kmÂ²',
    description: 'Commune la plus Ã©tendue de la rive gauche, la Commune IV est un pÃ´le dâ€™innovation technologique, universitaire et dâ€™activitÃ©s citoyennes portÃ©es par de nombreux incubateurs et coopÃ©ratives.',
    mayor: 'Adama BÃ©rÃ©tÃ©',
    mayorTeam: 'Maire et 6 adjoints entourÃ©s de commissions thÃ©matiques pour lâ€™emploi des jeunes.',
    townHallAddress: 'Boulevard Cheick Zayed, Lafiabougou, prÃ¨s du MarchÃ© Dabanani-Ouest',
    townHallPhone: '+223 20 29 02 14',
    townHallEmail: 'info@commune4.bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'Service dâ€™Ã©tat civil numÃ©risÃ©',
      'Affaires domaniales et fonciÃ¨res',
      'Action citoyenne et brigade dâ€™hygiÃ¨ne',
      'Espace dâ€™information jeunesse & insertion professionnelle'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune4-bamako',
    coordinates: { lat: 12.6247, lng: -8.0321 }
  },
  {
    id: 'c5',
    name: 'Commune V',
    district: 'District de Bamako',
    neighborhoods: ['Badalabougou', 'Quartier-Mali', 'Torokorobougou', 'Baco-Djicoroni', 'Sabalibougou', 'Daoudabougou', 'Garantiguibougou'],
    population: '410 000 hab.',
    superficie: '41,0 kmÂ²',
    description: 'SituÃ©e sur la rive droite du fleuve Niger aprÃ¨s le Pont des Martyrs et le Pont Roi Fahd, la Commune V abrite la colline du Savoir (Campus universitaire) et un fort dynamisme entrepreneurial fÃ©minin.',
    mayor: 'Amadou Ouattara',
    mayorTeam: 'Bureau municipal mobilisÃ© pour la salubritÃ© du fleuve Niger et les projets dâ€™Ã©nergie propre.',
    townHallAddress: 'Avenue de lâ€™OUA, Quartier-Mali, en face du Centre Culturel FranÃ§ais',
    townHallPhone: '+223 20 28 33 50',
    townHallEmail: 'secretariat@commune5-bamako.org',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'Actes dâ€™Ã©tat civil & LÃ©galisation',
      'Protection de lâ€™environnement fluvial et berges',
      'PÃ©piniÃ¨re communale dâ€™entreprises artisanales',
      'Bureau de gestion des plaintes et rÃ©clamations'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune5-bamako',
    coordinates: { lat: 12.6134, lng: -7.9912 }
  },
  {
    id: 'c6',
    name: 'Commune VI',
    district: 'District de Bamako',
    neighborhoods: ['Sogoniko', 'FaladiÃ©', 'Banankabougou', 'Magnambougou', 'Yirimadio', 'Missabougou', 'SÃ©nou', 'DianÃ©guÃ©bougou'],
    population: '520 000 hab.',
    superficie: '88,8 kmÂ²',
    description: 'Plus vaste commune du District de Bamako, porte dâ€™entrÃ©e aÃ©roportuaire (SÃ©nou) et carrefour logistique, la Commune VI rassemble de grands marchÃ©s de bÃ©tail et de multiples projets dâ€™agriculture pÃ©ri-urbaine.',
    mayor: 'Boubacar Keita',
    mayorTeam: 'Ã‰quipe municipale de 45 conseillers axÃ©e sur lâ€™amÃ©nagement des quartiers dâ€™extension.',
    townHallAddress: 'Carrefour de Sogoniko, Route de SÃ©gou, Bamako',
    townHallPhone: '+223 20 20 55 70',
    townHallEmail: 'contact@commune6.bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h30',
    services: [
      'Ã‰tat civil & Affaires gÃ©nÃ©rales',
      'ContrÃ´le sanitaire et assainissement des canaux',
      'Service voirie et sÃ©curitÃ© de proximitÃ©',
      'Guichet dâ€™accompagnement des groupements de femmes'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune6-bamako',
    coordinates: { lat: 12.5975, lng: -7.9354 }
  }
];
