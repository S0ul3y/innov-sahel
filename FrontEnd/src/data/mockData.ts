import { Commune, Initiative, Publication, Comment, CitizenContribution, UserAccount } from '../types';

export const INITIAL_COMMUNES: Commune[] = [
  {
    id: 'c1',
    name: 'Commune I',
    district: 'District de Bamako',
    neighborhoods: ['Korofina Nord', 'Korofina Sud', 'Djélibougou', 'Bankoni', 'Fadjiguila', 'Sotuba', 'Boulkassoumbougou', 'Doumanzana', 'Sikoro'],
    population: '350 000 hab.',
    superficie: '34,2 km²',
    description: 'Située sur la rive gauche du fleuve Niger, la Commune I est un carrefour dynamique regroupant d’importants marchés, des zones maraîchères le long du fleuve et une jeunesse très active dans l’artisanat et les énergies renouvelables.',
    mayor: 'Oumarou Togo',
    mayorTeam: 'Maire principal assisté de 5 adjoints et de 39 conseillers municipaux.',
    townHallAddress: 'Avenue Al Quds, Korofina Nord, près du Centre de Santé de Référence (CSREF)',
    townHallPhone: '+223 20 24 11 05',
    townHallEmail: 'contact@mairie-commune1-bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00 (Permanence état civil le samedi matin)',
    services: [
      'État civil (Naissances, Mariages, Décès, Certificats)',
      'Légalisation de documents & Certifications',
      'Urbanisme, Voirie & Autorisations de construire',
      'Hygiène, Assainissement & Salubrité publique',
      'Bureau d’écoute et d’orientation des jeunes'
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
    neighborhoods: ['Bagadadji', 'Medina-Coura', 'Bozola', 'Niaréla', 'Missira', 'Zone Industrielle', 'Quinzambougou', 'Bakorobabougou'],
    population: '210 000 hab.',
    superficie: '16,8 km²',
    description: 'Cœur historique et commercial de Bamako, la Commune II abrite le Grand Marché, le marché de Médina-Coura ainsi que de nombreux ateliers d’artisans et fabriques d’économie circulaire.',
    mayor: 'Cheick Abba Niaré',
    mayorTeam: 'Conseil municipal composé de 37 membres avec commissions jeunesse et salubrité.',
    townHallAddress: 'Boulevard du Peuple, Quartier Bozola, Face à l’ancienne Grande Mosquée',
    townHallPhone: '+223 20 22 34 88',
    townHallEmail: 'mairie.c2@bamako-sahel.org',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'Délivrance expresse d’actes d’état civil',
      'Taxes communales et marchés',
      'Commission d’assainissement urbain et collecte',
      'Guichet unique d’appui aux femmes commerçantes'
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
    neighborhoods: ['Badialan I, II & III', 'Darsalam', 'N’Tomikorobougou', 'Bamako-Coura', 'Koulouba', 'Point G', 'Ouolofobougou', 'Sogonafing'],
    population: '160 000 hab.',
    superficie: '23,0 km²',
    description: 'Siège des institutions républicaines (Palais de Koulouba) et de grands centres hospitaliers (Point G), la Commune III se distingue par ses collines verdoyantes et un tissu associatif féminin remarquable.',
    mayor: 'Mme Djiré Mariam Diallo',
    mayorTeam: 'Bureau communal engagé pour l’autonomisation des femmes et l’accès aux soins de proximité.',
    townHallAddress: 'Rue Nelson Mandela, Darsalam, Bamako',
    townHallPhone: '+223 20 22 45 19',
    townHallEmail: 'contact@commune3-bamako.gov.ml',
    openingHours: 'Lundi au Vendredi : 08h00 - 16h30',
    services: [
      'État civil & Recensement administratif',
      'Service social d’aide aux familles et femmes vulnérables',
      'Voirie communale et éclairage',
      'Appui aux initiatives éducatives et artisanales'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune3-bamako',
    coordinates: { lat: 12.6588, lng: -8.0052 }
  },
  {
    id: 'c4',
    name: 'Commune IV',
    district: 'District de Bamako',
    neighborhoods: ['Hamdallaye', 'Lafiabougou', 'Djicoroni-Para', 'Sébénikoro', 'Taliko', 'Sibiribougou', 'Lassa', 'Kalanban-Coura Ouest'],
    population: '380 000 hab.',
    superficie: '37,6 km²',
    description: 'Commune la plus étendue de la rive gauche, la Commune IV est un pôle d’innovation technologique, universitaire et d’activités citoyennes portées par de nombreux incubateurs et coopératives.',
    mayor: 'Adama Bérété',
    mayorTeam: 'Maire et 6 adjoints entourés de commissions thématiques pour l’emploi des jeunes.',
    townHallAddress: 'Boulevard Cheick Zayed, Lafiabougou, près du Marché Dabanani-Ouest',
    townHallPhone: '+223 20 29 02 14',
    townHallEmail: 'info@commune4.bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'Service d’état civil numérisé',
      'Affaires domaniales et foncières',
      'Action citoyenne et brigade d’hygiène',
      'Espace d’information jeunesse & insertion professionnelle'
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
    superficie: '41,0 km²',
    description: 'Située sur la rive droite du fleuve Niger après le Pont des Martyrs et le Pont Roi Fahd, la Commune V abrite la colline du Savoir (Campus universitaire) et un fort dynamisme entrepreneurial féminin.',
    mayor: 'Amadou Ouattara',
    mayorTeam: 'Bureau municipal mobilisé pour la salubrité du fleuve Niger et les projets d’énergie propre.',
    townHallAddress: 'Avenue de l’OUA, Quartier-Mali, en face du Centre Culturel Français',
    townHallPhone: '+223 20 28 33 50',
    townHallEmail: 'secretariat@commune5-bamako.org',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h00',
    services: [
      'Actes d’état civil & Légalisation',
      'Protection de l’environnement fluvial et berges',
      'Pépinière communale d’entreprises artisanales',
      'Bureau de gestion des plaintes et réclamations'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune5-bamako',
    coordinates: { lat: 12.6134, lng: -7.9912 }
  },
  {
    id: 'c6',
    name: 'Commune VI',
    district: 'District de Bamako',
    neighborhoods: ['Sogoniko', 'Faladié', 'Banankabougou', 'Magnambougou', 'Yirimadio', 'Missabougou', 'Sénou', 'Dianéguébougou'],
    population: '520 000 hab.',
    superficie: '88,8 km²',
    description: 'Plus vaste commune du District de Bamako, porte d’entrée aéroportuaire (Sénou) et carrefour logistique, la Commune VI rassemble de grands marchés de bétail et de multiples projets d’agriculture péri-urbaine.',
    mayor: 'Boubacar Keita',
    mayorTeam: 'Équipe municipale de 45 conseillers axée sur l’aménagement des quartiers d’extension.',
    townHallAddress: 'Carrefour de Sogoniko, Route de Ségou, Bamako',
    townHallPhone: '+223 20 20 55 70',
    townHallEmail: 'contact@commune6.bamako.ml',
    openingHours: 'Lundi au Vendredi : 07h30 - 16h30',
    services: [
      'État civil & Affaires générales',
      'Contrôle sanitaire et assainissement des canaux',
      'Service voirie et sécurité de proximité',
      'Guichet d’accompagnement des groupements de femmes'
    ],
    whatsappChannelUrl: 'https://whatsapp.com/channel/innovsahel-commune6-bamako',
    coordinates: { lat: 12.5975, lng: -7.9354 }
  }
];

export const INITIAL_INITIATIVES: Initiative[] = [
  {
    id: 'init-1',
    title: 'Sanuya Plastique : Pavés Écologiques & Recyclage',
    ownerName: 'Fatoumata Diallo',
    ownerType: 'femme',
    ownerBio: 'Ingénieure en environnement de 26 ans, formée à Bamako et lauréate du Lab’Citoyen 2025.',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&auto=format&fit=crop&q=80',
    communeId: 'c1',
    domain: 'Environnement & Assainissement',
    problem: 'La prolifération des sachets plastiques non dégradables qui bouchent les caniveaux et provoquent des inondations répétées à Korofina et Djelibougou.',
    solution: 'Collecte participative avec les femmes des quartiers et transformation des déchets plastiques fondus avec du sable pour fabriquer des pavés solides, écologiques et durables.',
    beneficiaries: '35 femmes rémunérées pour la collecte et 4 écoles communales déjà dotées de cours pavées saines.',
    startDate: '12 Janvier 2025',
    status: 'en_cours',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80', caption: 'Atelier de tri et fonte à température contrôlée' },
      { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&auto=format&fit=crop&q=80', caption: 'Pose des pavés dans la cour de l’école fondamentale de Korofina' },
      { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80', caption: 'L’équipe de collecte de la coopérative' }
    ],
    viewsCount: 1420,
    createdAt: '2025-01-15'
  },
  {
    id: 'init-2',
    title: 'Jardins Urbains & Maraîchage Fluvial Bio',
    ownerName: 'Aïssata Coulibaly & Collectif des Maraîchères',
    ownerType: 'collectif',
    ownerBio: 'Groupement de 40 mères de famille et jeunes agricultrices des berges du fleuve Niger.',
    ownerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=180&auto=format&fit=crop&q=80',
    communeId: 'c4',
    domain: 'Agriculture & Sécurité Alimentaire',
    problem: 'Cherté des légumes frais sur les marchés de Lafiabougou et manque de revenus stables pour les femmes sans formation professionnelle.',
    solution: 'Mise en place de parcelles de permaculture sans pesticides chimiques, irriguées grâce à des pompes solaires mobiles installées au bord du Niger.',
    beneficiaries: '45 familles directement soutenues, 1,2 tonne de légumes bio livrés chaque mois aux cantines et marchés locaux.',
    startDate: '04 Février 2025',
    status: 'en_cours',
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80', caption: 'Récolte des salades et tomates bio à Djicoroni' },
      { url: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop&q=80', caption: 'Installation du système d’arrosage solaire au goutte-à-goutte' }
    ],
    viewsCount: 980,
    createdAt: '2025-02-05'
  },
  {
    id: 'init-3',
    title: 'Lab Citoyen Numérique : Formations Jeunes & Démarches',
    ownerName: 'Mamadou Traoré',
    ownerType: 'jeune',
    ownerBio: 'Développeur web et formateur communautaire passionné par l’inclusion numérique dans les quartiers populaires.',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&auto=format&fit=crop&q=80',
    communeId: 'c2',
    domain: 'Éducation & Numérique',
    problem: 'Difficultés pour les personnes peu lettrées ou non connectées d’obtenir leurs pièces administratives et de candidater aux opportunités d’emploi.',
    solution: 'Un bus itinérant avec ordinateurs et connexion Internet offrant une assistance gratuite pour les démarches en ligne et des ateliers d’initiation aux outils numériques.',
    beneficiaries: 'Plus de 600 jeunes et femmes déjà accompagnés pour leurs CV, déclarations et démarches de permis.',
    startDate: '18 Novembre 2024',
    status: 'en_cours',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80', caption: 'Session de formation gratuite à Bozola' },
      { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', caption: 'Accompagnement individuel d’une artisane pour la vente en ligne' }
    ],
    viewsCount: 1650,
    createdAt: '2024-11-20'
  },
  {
    id: 'init-4',
    title: 'Soutien Mère-Enfant & Clinique Mobile d’Hygiène',
    ownerName: 'Dr. Aminata Kéita',
    ownerType: 'femme',
    ownerBio: 'Sage-femme coordinatrice d’un réseau de 15 soignantes bénévoles en Commune VI.',
    ownerAvatar: 'https://images.unsplash.com/photo-1594824813589-9a721d60f4d3?w=180&auto=format&fit=crop&q=80',
    communeId: 'c6',
    domain: 'Santé & Prévention',
    problem: 'Éloignement des centres de santé pour les femmes enceintes dans les zones périphériques de Sénou et Yirimadio.',
    solution: 'Visites médicales gratuites à bord d’un tricycle médicalisé équipé pour le dépistage précoce, les conseils nutritionnels et la distribution de kits d’accouchement aseptiques.',
    beneficiaries: '1 200 consultations prénatales réalisées et zéro décès évitable signalé dans la zone couverte.',
    startDate: '01 Octobre 2024',
    status: 'termine',
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80', caption: 'Sensibilisation aux gestes barrières et à l’allaitement maternel' }
    ],
    viewsCount: 2310,
    createdAt: '2024-10-02'
  },
  {
    id: 'init-5',
    title: 'Briquettes Vertes : Énergie Propre sans Déforestation',
    ownerName: 'Bakary Samaké & Collectif Éco-Énergie',
    ownerType: 'jeune',
    ownerBio: 'Jeune entrepreneur diplômé en gestion des ressources naturelles.',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&auto=format&fit=crop&q=80',
    communeId: 'c5',
    domain: 'Énergie & Climat',
    problem: 'La coupe abusive du bois de chauffe pour la cuisine familiale qui accélère la désertification et pollue l’air intérieur.',
    solution: 'Production de briquettes de cuisson à partir de coques d’arachides, de résidus de canne à sucre et de paille de riz compactés.',
    beneficiaries: 'Plus de 200 ménages équipés de foyers améliorés, réduisant le budget énergie des familles de 40%.',
    startDate: '10 Décembre 2024',
    status: 'en_cours',
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80', caption: 'Presse mécanique locale pour briquettes sans fumée' }
    ],
    viewsCount: 1120,
    createdAt: '2024-12-15'
  },
  {
    id: 'init-6',
    title: 'Teinture Végétale & Modernisation du Bogolan',
    ownerName: 'Kadiatou Dembélé',
    ownerType: 'femme',
    ownerBio: 'Artisane d’art textile formant des jeunes filles déscolarisées aux techniques traditionnelles durables.',
    ownerAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=180&auto=format&fit=crop&q=80',
    communeId: 'c3',
    domain: 'Culture & Artisanat',
    problem: 'Déperdition des savoir-faire ancestraux et utilisation de teintures chimiques nocives pour les cours d’eau.',
    solution: 'Atelier pilote de teinture 100% naturelle (boue fermentée, écorces de n’galama) et confection d’accessoires vendus sur le marché local et exportés.',
    beneficiaries: '25 jeunes filles sorties de la précarité et dotées d’un métier artisanal rémunérateur.',
    startDate: '15 Janvier 2025',
    status: 'demarre',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=900&auto=format&fit=crop&q=80',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80', caption: 'Application des motifs bogolan à la terre d’argile' }
    ],
    viewsCount: 840,
    createdAt: '2025-01-20'
  }
];

export const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-1',
    type: 'initiative_update',
    format: 'carousel',
    authorName: 'Fatoumata Diallo',
    authorRole: 'porteur',
    initiativeId: 'init-1',
    communeId: 'c1',
    title: 'La cour de l’école fondamentale de Korofina entièrement pavée !',
    metaDescription: 'Plus de 2 500 pavés écologiques issus du recyclage des sacs plastiques ont été posés ce week-end par les jeunes volontaires.',
    coverImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&auto=format&fit=crop&q=80',
    content: 'Grâce à la mobilisation extraordinaire des femmes de la coopérative Sanuya Plastique et au soutien de la Mairie de la Commune I, la cour de l’école fondamentale de Korofina est désormais transformée !\n\nFinie la boue lors de la saison des pluies : les élèves peuvent désormais courir en toute sécurité sur des pavés écologiques, lavables et imputrescibles. Nous avons valorisé près de 3 tonnes de plastique collecté dans les caniveaux du quartier.',
    carouselImages: [
      { url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&auto=format&fit=crop&q=80', caption: 'Les élèves découvrent leur nouvelle cour aménagée' },
      { url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&auto=format&fit=crop&q=80', caption: 'Stock de pavés prêts à la livraison' },
      { url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=900&auto=format&fit=crop&q=80', caption: 'Séance de tri préliminaire avec les mamans du quartier' }
    ],
    status: 'published',
    date: '14 Février 2025',
    viewsCount: 540
  },
  {
    id: 'pub-2',
    type: 'commune_news',
    format: 'video',
    authorName: 'Équipe IMPACT SAHEL / Mairie Commune IV',
    authorRole: 'admin',
    communeId: 'c4',
    title: 'Lancement officiel de la campagne de curage des caniveaux pré-hivernage',
    metaDescription: 'La Mairie de la Commune IV et IMPACT SAHEL s’associent pour anticiper les fortes pluies avec les comités de veille citoyenne.',
    coverImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80',
    content: 'Monsieur le Maire de la Commune IV et l’équipe du projet Lab’Citoyen ont lancé ce matin à Lafiabougou les opérations concertées de curage des collecteurs principaux.\n\nUne brigade citoyenne de 60 jeunes a été équipée de bottes, pelles et gants pour dégager les voies d’écoulement d’eau. Les citoyens sont appelés à signaler tout point d’engorgement via le bouton "Je signale un problème" sur InnovSahel.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    status: 'published',
    date: '10 Février 2025',
    viewsCount: 890
  },
  {
    id: 'pub-3',
    type: 'initiative_update',
    format: 'carousel',
    authorName: 'Aïssata Coulibaly',
    authorRole: 'porteur',
    initiativeId: 'init-2',
    communeId: 'c4',
    title: 'Première récolte abondante de tomates bio pour les cantines de Djicoroni',
    metaDescription: 'Nos pompes solaires ont permis une irrigation régulière et économique tout au long du mois de janvier.',
    coverImage: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=900&auto=format&fit=crop&q=80',
    content: 'C’est avec une immense joie que nous partageons les images de notre première grande récolte de la saison ! Plus de 400 paniers de tomates fermes et savoureuses ont été cueillis ce matin à l’aube.\n\nCette production locale sans engrais chimique permet à nos cantines scolaires d’offrir des repas équilibrés tout en assurant un revenu digne à 40 femmes cheffes de famille.',
    carouselImages: [
      { url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=900&auto=format&fit=crop&q=80', caption: 'Paniers de tomates prêts pour le marché du matin' },
      { url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&auto=format&fit=crop&q=80', caption: 'Arrosage matinal sous le soleil bienfaiteur' }
    ],
    status: 'published',
    date: '02 Février 2025',
    viewsCount: 420
  },
  {
    id: 'pub-4',
    type: 'commune_news',
    format: 'carousel',
    authorName: 'Mairie de la Commune II & IMPACT SAHEL',
    authorRole: 'admin',
    communeId: 'c2',
    title: 'Guichet numérique citoyen : horaires étendus pour les jeunes bacheliers',
    metaDescription: 'La Mairie de Bozola ouvre ses bureaux le samedi matin pour faciliter l’obtention des actes d’état civil et certificats de résidence.',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
    content: 'Afin d’éviter les files d’attente et de soutenir les élèves préparant leurs dossiers scolaires et universitaires, le service de l’état civil de la Commune II adapte ses créneaux d’ouverture.\n\nRetrouvez tous les détails pratiques, pièces à fournir et tarifs officiels directement dans la rubrique "Ma Commune" de la plateforme InnovSahel.',
    carouselImages: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80', caption: 'Nouvel espace d’accueil citoyen en Mairie de Commune II' },
      { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80', caption: 'Équipe d’assistance aux démarches administratives' }
    ],
    status: 'published',
    date: '28 Janvier 2025',
    viewsCount: 710
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    publicationId: 'pub-1',
    initiativeId: 'init-1',
    authorName: 'Salif Sanogo',
    authorRole: 'citoyen',
    message: 'Félicitations ma sœur Fatoumata ! Mes enfants étudient dans cette école et la différence est impressionnante. Bravo au projet Lab’Citoyen.',
    date: '14 Février 2025 à 15:30',
    reported: false
  },
  {
    id: 'comm-2',
    publicationId: 'pub-1',
    initiativeId: 'init-1',
    authorName: 'Fatoumata Diallo (Porteuse du projet)',
    authorRole: 'porteur',
    message: 'Merci beaucoup tonton Salif ! C’est grâce à vos encouragements et à l’aide des jeunes du quartier qu’on avance chaque jour.',
    date: '14 Février 2025 à 16:10',
    reported: false,
    parentCommentId: 'comm-1'
  },
  {
    id: 'comm-3',
    publicationId: 'pub-2',
    authorName: 'Kady Traoré',
    authorRole: 'citoyen',
    message: 'Très bonne initiative de la Mairie. N’oubliez pas aussi le grand caniveau derrière le terrain de football de Hamdallaye.',
    date: '11 Février 2025 à 09:20',
    reported: false
  },
  {
    id: 'comm-4',
    publicationId: 'pub-2',
    authorName: 'IMPACT SAHEL (Administrateur)',
    authorRole: 'admin',
    message: 'Bonjour Kady, merci pour votre signalement ! Nous avons transmis cette information précise à la brigade de voirie de la Commune IV.',
    date: '11 Février 2025 à 11:45',
    reported: false,
    parentCommentId: 'comm-3'
  }
];

export const INITIAL_CONTRIBUTIONS: CitizenContribution[] = [
  {
    id: 'cont-1',
    type: 'signalement',
    communeId: 'c1',
    category: 'Ordures et insalubrité',
    description: 'Dépôt sauvage d’ordures qui commence à déborder sur la voie goudronnée en face du centre de santé de Djélibougou.',
    photoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
    locationText: 'Djélibougou, Rue 240 près du rond-point',
    citizenName: 'Moussa Fofana',
    citizenPhone: '+223 76 54 32 10',
    internalStatus: 'transmis',
    internalNotes: 'Dossier transmis au chef du service assainissement de la Mairie le 12 Février. Benne programmée pour le ramassage.',
    createdAt: '2025-02-12T08:30:00Z'
  },
  {
    id: 'cont-2',
    type: 'idee',
    communeId: 'c4',
    category: 'Jeunesse',
    description: 'Organiser une journée mensuelle citoyenne où les jeunes et les commerçants nettoient ensemble le marché de Lafiabougou avec animation musicale et sensibilisation.',
    photoUrl: undefined,
    locationText: 'Marché de Lafiabougou',
    citizenName: 'Mariam Sidibé',
    citizenPhone: '+223 65 43 21 09',
    internalStatus: 'vu',
    internalNotes: 'Très belle proposition en phase avec le programme Lab’Citoyen. À mettre à l’ordre du jour de la commission municipale jeunesse.',
    createdAt: '2025-02-13T14:15:00Z'
  },
  {
    id: 'cont-3',
    type: 'signalement',
    communeId: 'c2',
    category: 'Éclairage public',
    description: 'Les lampadaires solaires ne fonctionnent plus depuis deux semaines dans la ruelle menant à l’école de Bozola, créant de l’insécurité le soir.',
    locationText: 'Bozola, Ruelle des potiers',
    citizenName: 'Ibrahim Touré',
    citizenPhone: '+223 78 90 12 34',
    internalStatus: 'nouveau',
    internalNotes: 'À vérifier avec le technicien d’éclairage communal.',
    createdAt: '2025-02-15T10:00:00Z'
  },
  {
    id: 'cont-4',
    type: 'idee',
    communeId: 'c5',
    category: 'Femmes',
    description: 'Créer un espace sécurisé de garderie solidaire à Badalabougou pour permettre aux mères commerçantes de laisser leurs bébés pendant qu’elles vendent au marché.',
    locationText: 'Badalabougou Marché',
    citizenName: 'Assetou Diarra',
    internalStatus: 'nouveau',
    createdAt: '2025-02-15T11:45:00Z'
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u-admin-1',
    name: 'Moussa Cissé',
    email: 'moussa.cisse@impactsahel.org',
    phone: '+223 20 23 45 67',
    role: 'admin',
    status: 'actif',
    lastLogin: 'Aujourd’hui à 11:20'
  },
  {
    id: 'u-admin-2',
    name: 'Aminata Traoré',
    email: 'aminata.traore@impactsahel.org',
    phone: '+223 70 12 34 56',
    role: 'admin',
    status: 'actif',
    lastLogin: 'Hier à 14:15'
  },
  {
    id: 'u-porteur-1',
    name: 'Fatoumata Diallo',
    email: 'fatoumata.diallo@sanuyaplastique.ml',
    phone: '+223 76 12 34 56',
    role: 'porteur',
    communeId: 'c1',
    initiativeName: 'Sanuya Plastique : Pavés Écologiques',
    status: 'actif',
    lastLogin: 'Hier à 16:45'
  },
  {
    id: 'u-porteur-2',
    name: 'Aïssata Coulibaly',
    email: 'aissata.marichage@biobamako.org',
    phone: '+223 66 98 76 54',
    role: 'porteur',
    communeId: 'c4',
    initiativeName: 'Jardins Urbains & Maraîchage Fluvial Bio',
    status: 'actif',
    lastLogin: '12 Février 2025'
  }
];
