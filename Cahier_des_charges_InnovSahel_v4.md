# Cahier des charges — Plateforme « InnovSahel »

**IMPACT SAHEL — Projet Lab'Citoyen**

*Plateforme citoyenne simple et accessible au service des communes du District de Bamako et des initiatives portées par les jeunes et les femmes*

|                        |                                                    |
|------------------------|----------------------------------------------------|
| **Maître d'ouvrage**   | IMPACT SAHEL                                       |
| **Projet cadre**       | Lab'Citoyen                                        |
| **Plateforme**         | InnovSahel                                         |
| **Territoire ciblé**   | Communes du District de Bamako                     |
| **Rôles authentifiés** | Administrateur IMPACT SAHEL · Porteur d'initiative |
| **Type de document**   | Cahier des charges fonctionnel et technique        |
| **Statut**             | Version 3                                          |
| **Diffusion**          | Prestataires candidats / équipe projet             |

## Sommaire

1. Contexte et présentation du projet

2. Objectifs du projet

3. Périmètre du projet

4. Rôles et utilisateurs

5. Architecture fonctionnelle

6. Spécifications fonctionnelles détaillées

7. Modules transversaux

8. Identité visuelle et ergonomie

9. Exigences non fonctionnelles

10. Authentification, sécurité et protection des données

11. Architecture technique

12. Tests et recette

13. Formation, livrables et maintenance

14. Planning prévisionnel

15. Budget indicatif

16. Évolutions futures

17. Modalités de réponse au cahier des charges

Annexe — Glossaire

## 1. Contexte et présentation du projet

Dans le cadre du projet Lab'Citoyen, IMPACT SAHEL souhaite concevoir, développer et mettre en ligne une plateforme numérique citoyenne dénommée « InnovSahel ». Ce projet s'inscrit dans la continuité du premier volet d'intervention « Engagement des femmes et des jeunes pour une gouvernance inclusive en période de transition grâce aux TIC ».

InnovSahel a pour vocation de valoriser les initiatives portées par les jeunes et les femmes, de faciliter l'accès des citoyens à l'information sur leur commune, et de leur permettre d'exprimer leurs idées et de signaler les problèmes qu'ils rencontrent dans leur cadre de vie.

### 1.1 Principe directeur : la simplicité avant tout

La plateforme s'adresse en priorité à un public large du District de Bamako, incluant des personnes peu ou non scolarisées et peu familières des outils numériques. La simplicité d'usage n'est donc pas un confort, mais une exigence fonctionnelle de premier rang.

Toute décision de conception (navigation, vocabulaire, formulaires, nombre d'étapes) doit être arbitrée en faveur de l'utilisateur le moins à l'aise avec le numérique. En cas d'arbitrage entre richesse fonctionnelle et simplicité, la simplicité l'emporte.

> **Ce document**
> • Il définit les exigences fonctionnelles, techniques, organisationnelles, budgétaires et calendaires de la plateforme.
> • Il constitue la base de la consultation des prestataires et du suivi de la réalisation.


## 2. Objectifs du projet

### 2.1 Objectif général

Doter IMPACT SAHEL et le projet Lab'Citoyen d'une plateforme numérique simple, accessible et durable, qui informe les citoyens des communes de Bamako, valorise les initiatives portées par les jeunes et les femmes, et recueille la parole citoyenne (idées et signalements) au bénéfice des communes.

### 2.2 Objectifs spécifiques

| **Objectif**                       | **Description**                                                                                                                                                |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Informer**                       | Permettre à tout citoyen d'accéder facilement aux informations sur sa commune et aux actualités publiées par IMPACT SAHEL et par les porteurs d'initiatives.   |
| **Valoriser**                      | Donner de la visibilité aux initiatives portées par les jeunes et les femmes, en les rattachant à la commune où elles sont menées.                             |
| **Recueillir la parole citoyenne** | Permettre à tout visiteur, sans création de compte, de proposer une idée, de signaler un problème et de commenter les publications.                            |
| **Outiller les porteurs**          | Donner aux jeunes et femmes porteurs d'initiatives un espace personnel simple pour publier et suivre l'avancement de leurs projets.                            |
| **Piloter**                        | Doter IMPACT SAHEL d'un tableau de bord permettant de suivre l'activité de la plateforme, de modérer les contenus et d'exploiter les contributions citoyennes. |

## 3. Périmètre du projet

Le présent projet couvre les éléments suivants :

- Conception UX/UI et identité visuelle de la plateforme, sur la base des couleurs de marque définies en section 8 ;

- Développement d'une plateforme web responsive, mobile-first, en Progressive Web App (PWA) ;

- Développement des six espaces fonctionnels décrits en section 5 ;

- Gestion de deux rôles authentifiés : Administrateur IMPACT SAHEL et Porteur d'initiative ;

- Accès public complet en consultation, sans création de compte ;

- Modules transversaux : commentaires, proposition d'idée, signalement de problème ;

- Back-office d'administration et tableaux de bord pour les deux rôles ;

- Intégration d'une carte de localisation pour chaque commune ;

- Intégration des contenus initiaux (fiches communes, initiatives, actualités de lancement) ;

- Hébergement, nom de domaine et mise en production ;

- Formation des administrateurs et des porteurs, et remise des guides d'utilisation ;

- Test bêta avec les porteurs de projets incubés ;

- Maintenance technique pendant 12 mois après la mise en ligne.

## 4. Rôles et utilisateurs

La plateforme distingue trois catégories d'utilisateurs, dont deux seulement disposent d'un compte.

### 4.1 Le visiteur citoyen (sans compte)

Il s'agit du public principal de la plateforme. Aucune inscription, aucune connexion, aucune donnée d'identification ne lui sont demandées pour accéder à l'ensemble des contenus et pour contribuer.

#### Ce qu'il peut faire

- Consulter l'ensemble des informations publiées sur la plateforme ;

- Rechercher et sélectionner sa commune ;

- Consulter les projets et initiatives ;

- Consulter les actualités et les événements annoncés ;

- Proposer une idée pour sa commune ;

- Signaler un problème dans sa commune ;

- Commenter toute publication (actualité, initiative, projet).

#### Ce qu'il ne peut pas faire

- Créer un compte ;

- Publier une actualité ou une fiche d'initiative ;

- Recevoir une réponse individuelle sur la plateforme à une idée ou à un signalement.

### 4.2 Le porteur d'initiative (jeunes et femmes)

Jeune ou femme porteuse d'un projet accompagné dans le cadre du Lab'Citoyen. Son compte est créé par un administrateur IMPACT SAHEL, qui lui transmet ses identifiants : il n'existe pas d'inscription libre en ligne.

#### Ce qu'il peut faire

- Se connecter à son espace personnel avec les identifiants fournis par IMPACT SAHEL ;

- Créer et mettre à jour la fiche de son ou ses initiative(s) ;

- Publier des actualités d'avancement de son projet (texte, photos, vidéo) ;

- Rattacher chaque initiative et chaque publication à la commune concernée ;

- Consulter les commentaires laissés sous ses publications ;

- Suivre les statistiques de consultation de ses publications (voir section 6.5) ;

- Modifier son mot de passe et les informations de son profil.

#### Règle de gestion

- Les publications des porteurs sont mises en ligne immédiatement, sans validation préalable de l'administrateur.

- L'administrateur conserve la possibilité de modifier, masquer ou supprimer toute publication a posteriori.

- Un porteur ne peut ni voir ni modifier les publications d'un autre porteur.

### 4.3 L'administrateur IMPACT SAHEL

Membre de l'équipe IMPACT SAHEL en charge de l'animation et de la supervision de la plateforme.

#### Ce qu'il peut faire

- Créer, suspendre et supprimer les comptes des porteurs d'initiatives ;

- Réinitialiser le mot de passe d'un porteur ;

- Publier, modifier et supprimer les actualités des communes ;

- Créer et mettre à jour les fiches des communes ;

- Modifier, masquer ou supprimer toute publication d'un porteur ;

- Modérer les commentaires (suppression a posteriori) ;

- Consulter, traiter et exporter les idées et signalements reçus ;

- Consulter le tableau de bord global de la plateforme ;

- Gérer les contenus institutionnels (page « À propos », mentions légales).

### 4.4 Synthèse des droits

| **Action**                                   | **Visiteur** | **Porteur**     | **Admin** |
|----------------------------------------------|--------------|-----------------|-----------|
| **Consulter tous les contenus**              | Oui          | Oui             | Oui       |
| **Commenter une publication**                | Oui          | Oui             | Oui       |
| **Proposer une idée / signaler un problème** | Oui          | Oui             | Oui       |
| **Publier une actualité d'initiative**       | Non          | Oui             | Oui       |
| **Créer / modifier une fiche d'initiative**  | Non          | Sa/ses fiche(s) | Toutes    |
| **Publier une actualité de commune**         | Non          | Non             | Oui       |
| **Gérer les fiches communes**                | Non          | Non             | Oui       |
| **Modérer / supprimer un commentaire**       | Non          | Non             | Oui       |
| **Consulter idées et signalements reçus**    | Non          | Non             | Oui       |
| **Gérer les comptes utilisateurs**           | Non          | Non             | Oui       |

## 5. Architecture fonctionnelle

La plateforme s'organise autour de six espaces seulement, afin de limiter la charge cognitive et de rendre la navigation immédiatement compréhensible.

| **Espace**             | **Accessible à** | **Rôle dans le parcours**                                                          |
|------------------------|------------------|------------------------------------------------------------------------------------|
| **1. Accueil**         | Tous             | Point d'entrée, orientation vers la commune et mise en avant des contenus récents. |
| **2. Ma Commune**      | Tous             | Cœur de la plateforme : tout ce qui concerne une commune donnée.                   |
| **3. Nos Initiatives** | Tous             | Vitrine de l'ensemble des initiatives portées par les jeunes et les femmes.        |
| **4. Actualités**      | Tous             | Fil unique regroupant toutes les publications de la plateforme.                    |
| **5. Mon Espace**      | Porteur / Admin  | Tableau de bord, adapté au rôle de l'utilisateur connecté.                         |
| **6. À propos**        | Tous             | Présentation d'IMPACT SAHEL, du Lab'Citoyen et mentions légales.                   |

### 5.1 Circulation des publications entre les espaces

Une publication n'existe qu'une seule fois dans le système, mais s'affiche dans plusieurs espaces selon sa nature et sa commune de rattachement. Cette règle est structurante pour le modèle de données.

| **Type de publication**                           | **Publiée par**    | **S'affiche sur**                                                                    |
|---------------------------------------------------|--------------------|--------------------------------------------------------------------------------------|
| **Actualité de commune**                          | Administrateur     | Ma Commune (section Actualités de la commune concernée) + Actualités                 |
| **Fiche d'initiative**                            | Porteur (ou Admin) | Nos Initiatives + Ma Commune (commune de réalisation)                                |
| **Actualité d'initiative / avancement de projet** | Porteur            | Nos Initiatives (fiche du projet) + Actualités + Ma Commune (commune de réalisation) |

> **Règle de gestion essentielle**
> • Chaque publication doit obligatoirement être rattachée à une commune au moment de sa création.
> • Ce rattachement conditionne son affichage dans l'espace « Ma Commune ».
> • Une publication sans commune ne doit pas pouvoir être enregistrée.


## 6. Spécifications fonctionnelles détaillées

### 6.1 Accueil

Page d'entrée de la plateforme. Son unique objectif est d'orienter immédiatement le visiteur, sans qu'il ait à comprendre l'organisation du site.

#### Contenu de la page, de haut en bas

- Bandeau d'identification : logo et nom InnovSahel, accompagnés d'une phrase d'accroche courte expliquant ce qu'est la plateforme ;

- Sélecteur de commune en position dominante : « Choisissez votre commune », sous forme de six grands boutons tactiles (un par commune), immédiatement visibles sans défilement sur smartphone ;

- Trois boutons d'action principaux, larges et illustrés d'un pictogramme : « Je propose une idée », « Je signale un problème », « Je découvre les initiatives » ;

- Dernières actualités : trois à cinq publications récentes, toutes origines confondues ;

- Initiatives mises en avant : trois à quatre fiches d'initiatives ;

- Chiffres clés : nombre d'initiatives, nombre de communes couvertes, nombre de contributions citoyennes reçues.

#### Exigence d'ergonomie

- Depuis l'accueil, l'accès à la fiche d'une commune, à une idée ou à un signalement doit se faire en un seul clic.

### 6.2 Ma Commune

Espace central de la plateforme. Il regroupe, pour une commune donnée, l'ensemble des informations et des contenus qui la concernent.

#### 6.2.1 Sélecteur de commune

Le visiteur choisit sa commune parmi les communes du District de Bamako. Le sélecteur est présenté sous forme de grands boutons portant le nom de la commune et, pour aider à la reconnaissance, les principaux quartiers qui la composent.

> **Point à confirmer par IMPACT SAHEL**
> • Le District de Bamako compte six communes (Commune I à Commune VI).
> • Le présent document retient les six communes du District.
> • Si le projet ne cible volontairement que cinq d'entre elles, IMPACT SAHEL devra préciser lesquelles avant le démarrage des développements.


Le choix de la commune est mémorisé sur l'appareil du visiteur, afin qu'il retrouve directement sa commune lors de ses visites suivantes, avec la possibilité d'en changer à tout moment.

#### 6.2.2 Fiche d'identité de la commune

Informations à renseigner et à afficher pour chaque commune :

- Nom de la commune et District de rattachement ;

- Liste des principaux quartiers qui la composent ;

- Population estimée et superficie, lorsque l'information est disponible ;

- Brève présentation de la commune (quelques lignes, langage simple) ;

- Nom du maire et composition sommaire de l'équipe municipale ;

- Adresse physique de la mairie ;

- Numéro(s) de téléphone et adresse e-mail de la mairie ;

- Horaires d'ouverture de la mairie ;

- Principaux services administratifs disponibles (état civil, urbanisme, état des lieux, etc.) ;

- Liens vers les pages officielles de la commune sur les réseaux sociaux, le cas échéant.

#### 6.2.3 Carte de localisation

Chaque fiche commune comporte une carte interactive indiquant la position de la commune et celle de la mairie.

- Intégration d'une carte (Google Maps, OpenStreetMap ou équivalent) centrée sur la commune ;

- Marqueur positionné sur la mairie de la commune ;

- Bouton « Itinéraire » ouvrant l'application de navigation du téléphone vers la mairie ;

- La carte doit se charger de manière différée (après le reste de la page) afin de ne pas pénaliser l'affichage en connexion faible ;

- Une image statique de repli doit s'afficher si la carte ne peut pas se charger.

#### 6.2.4 Actualités de la commune

Section regroupant toutes les publications rattachées à la commune sélectionnée :

- Actualités publiées par les administrateurs IMPACT SAHEL pour cette commune ;

- Actualités d'avancement publiées par les porteurs dont le projet est réalisé dans cette commune ;

- Affichage antéchronologique (la plus récente en premier) ;

- Chaque élément affiche : titre, image ou photo, date, auteur (IMPACT SAHEL ou nom du porteur), extrait court ;

- Un filtre simple permet de n'afficher que les actualités de la mairie ou que celles des initiatives.

#### 6.2.5 Initiatives dans la commune

Liste des fiches d'initiatives rattachées à la commune, présentées sous forme de cartes cliquables menant vers la fiche détaillée (voir 6.3).

#### 6.2.6 Participation citoyenne

La fiche commune intègre, en bas de page et de manière visible, les deux formulaires transversaux décrits en sections 7.3 et 7.4 : « Je propose une idée » et « Je signale un problème », pré-renseignés avec la commune actuellement sélectionnée.

### 6.3 Nos Initiatives

Vitrine de l'ensemble des initiatives portées par les jeunes et les femmes dans le cadre du Lab'Citoyen.

#### 6.3.1 Vue liste

- Grille de cartes d'initiatives : photo, nom du projet, nom du porteur, commune, domaine d'intervention ;

- Filtres simples et visuels : par commune et par domaine ;

- Recherche par mot-clé ;

- Affichage par défaut : toutes les initiatives, les plus récemment mises à jour en premier.

#### 6.3.2 Fiche détaillée d'une initiative

Chaque initiative dispose d'une page dédiée comportant :

- Nom du projet et photo de couverture ;

- Nom et présentation du porteur (jeune ou femme), avec photo si le porteur le souhaite ;

- Commune de réalisation, avec lien vers la fiche de la commune ;

- Domaine d'intervention ;

- Problème identifié et solution apportée, en langage simple ;

- Bénéficiaires du projet ;

- Date de démarrage et état d'avancement, exprimé de manière visuelle (par exemple : Démarré / En cours / Terminé) ;

- Galerie de photos et vidéos ;

- Fil des actualités d'avancement publiées par le porteur, de la plus récente à la plus ancienne ;

- Espace de commentaires (voir section 7.2) ;

- Boutons de partage vers WhatsApp, Facebook et autres réseaux sociaux.

### 6.4 Actualités

Fil unique regroupant l'ensemble des publications de la plateforme, quelle qu'en soit l'origine : actualités de communes publiées par IMPACT SAHEL et actualités d'initiatives publiées par les porteurs.

- Affichage antéchronologique ;

- Chaque publication affiche : image, titre, date, auteur, commune concernée, extrait ;

- Filtres simples : par commune, et par type (actualités de la mairie / actualités des initiatives) ;

- Page de détail de la publication avec le contenu complet, les médias associés et l'espace de commentaires ;

- Boutons de partage vers les réseaux sociaux, WhatsApp en priorité.

Les événements et annonces (rencontres, forums, cérémonies) sont diffusés sous forme d'actualités.

### 6.5 Mon Espace — tableau de bord du porteur d'initiative

Espace personnel accessible après connexion avec les identifiants transmis par IMPACT SAHEL. Il doit être utilisable sans formation préalable approfondie : peu d'écrans, vocabulaire courant, formulaires courts.

#### 6.5.1 Écran d'accueil du porteur

- Message de bienvenue nominatif ;

- Trois indicateurs simples, présentés en gros caractères : nombre de publications, nombre total de vues, nombre de commentaires reçus ;

- Bouton principal, très visible : « Publier une actualité » ;

- Liste de ses publications récentes, avec pour chacune le nombre de vues et de commentaires ;

- Alerte visuelle en cas de nouveaux commentaires non consultés.

#### 6.5.2 Gestion de la fiche d'initiative

- Création et modification de la fiche de son initiative (champs décrits en 6.3.2) ;

- Ajout et suppression de photos et de vidéos ;

- Mise à jour de l'état d'avancement du projet ;

- Le champ « commune de réalisation » est obligatoire.

#### 6.5.3 Publication d'une actualité d'avancement

Le porteur publie ses actualités d'avancement au moyen du formulaire de publication décrit en section 7.1, commun aux deux rôles authentifiés. La commune concernée y est pré-remplie avec la commune de son initiative.

#### Règles de gestion

- La publication est immédiatement visible après validation par le porteur, sans intervention de l'administrateur.

- Le porteur peut modifier ou supprimer ses propres publications.

- Les images déposées doivent être automatiquement compressées et redimensionnées côté plateforme.

#### 6.5.4 Commentaires reçus

- Liste des commentaires déposés sous ses publications ;

- Possibilité de répondre à un commentaire ;

- Possibilité de signaler un commentaire inapproprié à l'administrateur.

### 6.6 Mon Espace — tableau de bord administrateur IMPACT SAHEL

Interface de pilotage et d'administration de la plateforme, réservée à l'équipe IMPACT SAHEL.

#### 6.6.1 Vue d'ensemble

Écran d'entrée présentant les indicateurs clés de la plateforme :

| **Indicateur**         | **Précision attendue**                                                                  |
|------------------------|-----------------------------------------------------------------------------------------|
| **Visiteurs**          | Nombre de visiteurs sur la période, avec évolution par rapport à la période précédente  |
| **Publications**       | Nombre total, réparti entre actualités de communes et actualités d'initiatives          |
| **Initiatives**        | Nombre de fiches d'initiatives publiées, réparties par commune                          |
| **Porteurs actifs**    | Nombre de porteurs ayant publié au moins une fois sur la période                        |
| **Idées reçues**       | Nombre de propositions citoyennes, réparties par commune et par catégorie               |
| **Signalements reçus** | Nombre de signalements, répartis par commune, par catégorie et par statut de traitement |
| **Commentaires**       | Nombre de commentaires déposés, dont commentaires signalés                              |

Ces indicateurs sont complétés par deux à trois graphiques simples : évolution des contributions citoyennes dans le temps, et répartition des contributions par commune.

#### 6.6.2 Gestion des comptes porteurs

- Création d'un compte porteur : nom, prénom, téléphone, e-mail, commune, nom de l'initiative ;

- Génération d'un mot de passe provisoire à transmettre au porteur ;

- Réinitialisation du mot de passe d'un porteur ;

- Suspension et suppression d'un compte ;

- Liste des comptes avec leur statut (actif, suspendu) et leur date de dernière connexion.

#### 6.6.3 Gestion des communes

- Création et modification des fiches communes (champs décrits en 6.2.2) ;

- Renseignement des coordonnées géographiques utilisées par la carte ;

- Publication, modification et suppression des actualités d'une commune, au moyen du formulaire de publication décrit en section 7.1.

#### 6.6.4 Traitement des contributions citoyennes

Les idées et les signalements déposés par les citoyens ne sont pas publics : ils sont reçus dans une boîte de réception réservée aux administrateurs.

- Liste des idées reçues, filtrable par commune, par catégorie et par date ;

- Liste des signalements reçus, filtrable par commune, par catégorie, par statut et par date ;

- Consultation du détail d'une contribution : contenu, catégorie, commune, photo jointe, localisation indiquée, date de réception ;

- Attribution d'un statut de traitement interne : Nouveau / Vu / Transmis à la commune / Clôturé ;

- Ajout d'une note interne sur une contribution ;

- Export de la liste des contributions au format tableur (CSV ou Excel), pour transmission aux communes et pour le reporting bailleurs.

> **Règle de gestion**
> • Le statut de traitement est strictement interne : il n'est jamais visible par le citoyen.
> • Aucune notification n'est renvoyée à l'auteur d'une idée ou d'un signalement.


#### 6.6.5 Modération

- Consultation de l'ensemble des commentaires, du plus récent au plus ancien ;

- Accès prioritaire aux commentaires signalés par les porteurs ou par les visiteurs ;

- Suppression d'un commentaire ;

- Masquage ou suppression d'une publication de porteur ;

- Journal des actions de modération, indiquant l'auteur et la date de chaque intervention.

#### 6.6.6 Gestion des contenus institutionnels

- Modification du contenu de la page « À propos », des mentions légales et de la politique de confidentialité.

### 6.7 À propos d'InnovSahel

- Présentation d'IMPACT SAHEL et du projet Lab'Citoyen ;

- Explication simple de ce qu'est InnovSahel et de ce qu'un citoyen peut y faire ;

- Partenaires et bailleurs ;

- Coordonnées de contact ;

- Mentions légales et politique de confidentialité.

## 7. Modules transversaux

Ces modules ne constituent pas des pages autonomes : ils sont intégrés à plusieurs endroits de la plateforme et obéissent partout aux mêmes règles.

### 7.1 Formulaire de publication de contenu

Ce formulaire est l'outil unique de création de contenu de la plateforme. Il est utilisé aussi bien par les administrateurs IMPACT SAHEL pour publier les actualités des communes que par les porteurs pour publier les actualités d'avancement de leurs initiatives. Les deux rôles disposent exactement des mêmes champs et des mêmes fonctions d'édition.

#### 7.1.1 Choix du format de publication

La première étape du formulaire demande à l'auteur de choisir le format de sa publication, au moyen de deux options présentées visuellement :

- Carrousel d'images : la publication s'illustre d'une ou plusieurs photographies que le lecteur fait défiler ;

- Vidéo : la publication s'illustre d'une vidéo hébergée sur YouTube.

Le choix effectué conditionne les champs affichés ensuite : l'auteur ne voit que les champs correspondant au format retenu.

#### 7.1.2 Champs communs aux deux formats

| **Champ**               | **Type**                 | **Obligatoire** | **Précisions**                                                                                                                                                                                             |
|-------------------------|--------------------------|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Titre principal**     | Texte court              | Oui             | Titre de la publication, affiché dans toutes les listes et en tête de la page de détail.                                                                                                                   |
| **Méta description**    | Texte court              | Oui             | Résumé de deux à trois lignes. Utilisé comme extrait dans les listes, dans les aperçus de partage sur les réseaux sociaux et par les moteurs de recherche. Un compteur de caractères doit guider l'auteur. |
| **Image mise en avant** | Dépôt d'image            | Oui             | Image de couverture de la publication (voir 7.1.5).                                                                                                                                                        |
| **Contenu**             | Éditeur de texte enrichi | Oui             | Corps de la publication (voir 7.1.4).                                                                                                                                                                      |
| **Commune concernée**   | Sélection                | Oui             | Détermine l'affichage de la publication dans l'espace Ma Commune.                                                                                                                                          |

#### 7.1.3 Champs propres à chaque format

Format « Carrousel d'images » :

- Dépôt de plusieurs images en une seule opération, depuis le téléphone ou l'ordinateur ;

- Réordonnancement des images par glisser-déposer, avec une solution de remplacement accessible par boutons pour les appareils où le glisser-déposer est malaisé ;

- Légende facultative pour chaque image ;

- Suppression individuelle d'une image avant publication ;

- À la lecture, le carrousel défile par balayage sur mobile et par flèches sur ordinateur, avec un indicateur de position.

Format « Vidéo » :

- Champ de saisie d'un lien YouTube, seul champ requis pour la vidéo ;

- Validation automatique du lien au moment de la saisie, avec message d'erreur explicite si le lien n'est pas un lien YouTube valide ;

- Aperçu de la vidéo affiché immédiatement dans le formulaire, afin que l'auteur vérifie qu'il s'agit bien de la bonne vidéo ;

- À la lecture, la vidéo est lue directement depuis la plateforme, sans que le visiteur ait à quitter le site ;

- Le lecteur vidéo se charge de manière différée : seule la vignette est affichée au chargement de la page, la vidéo n'étant chargée qu'au moment où le visiteur la lance, afin de préserver la bande passante.

#### 7.1.4 Éditeur de texte enrichi

Le champ de contenu est un éditeur de texte enrichi, offrant une mise en forme visuelle immédiate : l'auteur voit le résultat pendant qu'il écrit, sans avoir à connaître le moindre code de mise en forme.

Fonctions de mise en forme attendues :

- Gras et italique ;

- Souligné et barré ;

- Titres intermédiaires à deux niveaux, pour structurer un texte long ;

- Listes à puces et listes numérotées ;

- Citation mise en retrait ;

- Lien hypertexte ;

- Insertion d'images à l'intérieur du texte, entre deux paragraphes, avec légende facultative ;

- Annulation et rétablissement de la dernière action ;

- Suppression de la mise en forme d'une sélection, utile lorsqu'un texte est collé depuis une autre application.

#### Exigences d'ergonomie de l'éditeur

- Barre d'outils réduite aux seules fonctions listées ci-dessus : aucune fonction superflue ;

- Boutons représentés par des pictogrammes universellement reconnus, avec libellé au survol ;

- Barre d'outils restant accessible lors du défilement sur mobile ;

- Enregistrement automatique du brouillon pendant la saisie, afin qu'aucun contenu ne soit perdu en cas de coupure de connexion ;

- Bouton « Aperçu » permettant de voir la publication telle qu'elle apparaîtra avant de la publier.

> **Sécurité de l'éditeur**
> • Le contenu saisi doit être systématiquement nettoyé côté serveur avant enregistrement.
> • Seules les balises de mise en forme autorisées sont conservées ; tout script ou code injecté est supprimé.


#### 7.1.5 Image mise en avant

Chaque publication comporte obligatoirement une image mise en avant, qui constitue sa vignette d'identification.

- Elle s'affiche en premier, avant le contenu détaillé, sur toutes les listes : accueil, page Actualités, section Actualités de la commune, fiche d'initiative ;

- Elle s'affiche en tête de la page de détail de la publication ;

- Elle est utilisée comme visuel d'aperçu lors du partage sur WhatsApp, Facebook et les autres réseaux sociaux ;

- Elle est obligatoire quel que soit le format retenu : pour une publication au format vidéo également ;

- Pour le format vidéo, l'auteur peut soit déposer sa propre image, soit récupérer automatiquement la vignette de la vidéo YouTube d'un simple bouton ;

- Le cadrage utile de l'image doit être prévisualisé dans le formulaire, afin que l'auteur constate le rendu dans les listes avant de publier ;

- L'image est automatiquement compressée, redimensionnée et déclinée en plusieurs tailles, afin que les listes chargent des versions légères.

#### 7.1.6 Enregistrement et publication

- Bouton « Enregistrer comme brouillon » : la publication est conservée sans être visible du public ;

- Bouton « Publier » : la publication devient immédiatement visible ;

- Contrôle des champs obligatoires avant publication, avec un message d'erreur clair désignant le champ manquant ;

- Après publication, un message de confirmation propose de consulter la publication en ligne ;

- Toute publication peut être modifiée ou supprimée ultérieurement par son auteur, et par un administrateur.

### 7.2 Espace de commentaires

Un espace de commentaires est présent sous chaque publication : actualité de commune, actualité d'initiative, fiche d'initiative.

#### Fonctionnement

- Ouvert à toute personne, sans création de compte ;

- Champs demandés : prénom ou pseudonyme, et message. Aucun autre champ obligatoire ;

- Le commentaire s'affiche immédiatement après envoi, sans validation préalable ;

- Affichage antéchronologique, avec date de publication ;

- Les porteurs et les administrateurs peuvent répondre à un commentaire ; leur réponse est identifiée visuellement comme provenant de l'auteur de la publication ou d'IMPACT SAHEL ;

- Un lien discret « Signaler ce commentaire » est disponible sur chaque commentaire ;

- L'administrateur peut supprimer tout commentaire a posteriori.

#### Mesures anti-abus attendues

- Limitation du nombre de commentaires par appareil sur une période donnée ;

- Protection anti-robot discrète, ne devant pas reposer sur une énigme visuelle complexe difficile d'accès pour le public visé ;

- Filtre automatique sur une liste de mots interdits, paramétrable par l'administrateur.

### 7.3 « Je propose une idée »

Formulaire permettant à tout citoyen de proposer une idée pour l'amélioration de sa commune. Accessible depuis l'accueil, depuis la fiche de chaque commune et depuis le menu principal.

#### Champs du formulaire

| **Champ**             | **Type**                             | **Obligatoire**                                           |
|-----------------------|--------------------------------------|-----------------------------------------------------------|
| **Commune concernée** | Sélection parmi les communes         | Oui (pré-remplie si le visiteur a déjà choisi sa commune) |
| **Catégorie**         | Sélection visuelle avec pictogrammes | Oui                                                       |
| **Mon idée**          | Texte libre                          | Oui                                                       |
| **Photo**             | Dépôt depuis le téléphone            | Non                                                       |
| **Prénom**            | Texte court                          | Non                                                       |
| **Téléphone**         | Numéro                               | Non                                                       |

Catégories proposées à titre indicatif, à valider par IMPACT SAHEL : Jeunesse, Femmes, Environnement et assainissement, Éducation, Santé, Infrastructures et voirie, Éclairage public, Activités culturelles et sportives, Autre.

### 7.4 « Je signale un problème »

Formulaire permettant à tout citoyen de signaler un problème constaté dans sa commune. Doit être accessible depuis l'accueil, depuis la fiche de chaque commune, depuis le menu principal et, de manière discrète mais permanente, via un bouton flottant présent sur l'ensemble du site.

#### Champs du formulaire

| **Champ**                 | **Type**                                          | **Obligatoire**                 |
|---------------------------|---------------------------------------------------|---------------------------------|
| **Commune concernée**     | Sélection parmi les communes                      | Oui (pré-remplie si applicable) |
| **Catégorie du problème** | Sélection visuelle avec pictogrammes              | Oui                             |
| **Description**           | Texte libre                                       | Oui                             |
| **Photo du problème**     | Dépôt depuis le téléphone                         | Non, mais fortement encouragé   |
| **Lieu**                  | Texte libre (quartier, repère) et/ou position GPS | Non                             |
| **Prénom**                | Texte court                                       | Non                             |
| **Téléphone**             | Numéro                                            | Non                             |

Catégories proposées à titre indicatif : Ordures et insalubrité, Eau et assainissement, Éclairage public, Voirie et routes, Sécurité, Infrastructures dégradées, Autre.

### 7.5 Message de confirmation après envoi

À l'issue de l'envoi d'une idée ou d'un signalement, un message de confirmation s'affiche, remerciant le citoyen et le rassurant sur la prise en compte de sa contribution.

> **Règles impératives**
> • Aucune réponse individuelle n'est apportée au citoyen sur la plateforme.
> • Aucun suivi de statut n'est consultable par le citoyen.
> • Les idées et signalements ne sont pas affichés publiquement sur la plateforme.
> • Le message ne doit promettre ni délai, ni résolution, ni réponse : il remercie et rassure sur la transmission.


Proposition de formulation, à valider par IMPACT SAHEL : « Merci ! Votre message a bien été reçu. Il sera transmis aux responsables de votre commune. Votre participation contribue à améliorer la vie de votre quartier. »

Le message de confirmation doit être visuel autant que textuel (pictogramme de validation), afin d'être compris même par une personne ne lisant pas aisément.

### 7.6 Notifications

#### Visiteurs citoyens

Aucune notification n'est envoyée aux visiteurs de la plateforme, quel que soit le canal. Les citoyens n'ayant pas de compte, aucune adresse ni aucun numéro n'est collecté à cette fin, et aucun accusé de réception ni suivi n'est transmis après le dépôt d'une idée, d'un signalement ou d'un commentaire.

#### Administrateurs IMPACT SAHEL

Les administrateurs sont avertis par courrier électronique de chaque contribution citoyenne reçue.

- Un e-mail est envoyé à chaque dépôt d'une proposition d'idée ;

- Un e-mail est envoyé à chaque signalement de problème ;

- L'e-mail indique le type de contribution, la commune concernée, la catégorie, la date de réception et un extrait du contenu ;

- Il comporte un lien direct vers la contribution dans le tableau de bord administrateur ;

- Les adresses destinataires sont paramétrables par les administrateurs, et plusieurs destinataires peuvent être définis ;

- Une option permet de regrouper les notifications en un récapitulatif quotidien unique plutôt qu'un e-mail par contribution, afin d'éviter la saturation en cas de forte affluence.

## 8. Identité visuelle et ergonomie

### 8.1 Couleurs de marque

| **Couleur**          | **Code**                     | **Usage**                                                                                                                                             |
|----------------------|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Jaune InnovSahel** | \#FADB58                     | Couleur d'accent : boutons d'action principaux, éléments à mettre en avant, pictogrammes. À utiliser avec un texte foncé, jamais avec un texte blanc. |
| **Bleu InnovSahel**  | \#38B6FF                     | Couleur principale : bandeaux, en-têtes, éléments de navigation, liens, fonds de section.                                                             |
| **Bleu foncé**       | À définir par le prestataire | Déclinaison foncée du bleu de marque, réservée aux textes de titre et aux éléments devant respecter les contrastes d'accessibilité.                   |
| **Neutres**          | Blanc et gris foncé          | Fonds de page et textes courants.                                                                                                                     |

> **Contrainte d'accessibilité**
> • Le jaune #FADB58 et le bleu #38B6FF sont des couleurs claires : elles ne doivent jamais porter du texte blanc.
> • Les textes doivent respecter un rapport de contraste suffisant sur fond coloré.
> • Le prestataire proposera des déclinaisons foncées de ces deux couleurs pour les usages typographiques.


### 8.2 Principes d'ergonomie

La plateforme s'adressant notamment à des personnes peu scolarisées et peu familières du numérique, les principes suivants sont contractuels :

- Navigation principale limitée à six entrées maximum, toujours visibles ;

- Sur smartphone, barre de navigation fixe en bas d'écran avec pictogramme et libellé court pour chaque entrée ;

- Boutons de grande taille, largement espacés, adaptés à une utilisation au pouce ;

- Chaque action importante est représentée par un pictogramme accompagné d'un texte : jamais un pictogramme seul ;

- Vocabulaire courant, phrases courtes, aucun terme technique ni sigle non expliqué ;

- Formulaires courts, avec un nombre minimal de champs obligatoires ;

- Aucune fonctionnalité ne doit nécessiter plus de trois clics depuis l'accueil ;

- Le contenu prime sur le décor : peu d'animations, pas d'effets superflus ;

- Taille de police de base généreuse (16 pixels minimum) et possibilité d'agrandir le texte ;

- Retours visuels systématiques après chaque action (message de confirmation, changement d'état du bouton).

### 8.3 Iconographie et imagerie

- Pictogrammes simples, universels, immédiatement reconnaissables ;

- Photographies privilégiant les réalités locales des communes de Bamako ;

- Aucun cliché visuel stéréotypé ;

- Toutes les images doivent être compressées et accompagnées d'un texte alternatif.

## 9. Exigences non fonctionnelles

### 9.1 Mobile-first

Le smartphone est le terminal principal d'accès. La conception part de l'écran mobile, puis s'adapte à la tablette et à l'ordinateur. Une maquette mobile validée est un préalable à tout développement.

### 9.2 Faible bande passante

- Compression et redimensionnement automatiques de toutes les images déposées, au format WebP de préférence ;

- Chargement différé des images et de la carte ;

- Pages légères : moins de 500 Ko hors médias ;

- Fonctionnement acceptable en connexion 3G ;

- Mise en cache des contenus déjà consultés (Progressive Web App), permettant de relire les pages visitées en cas de perte de connexion.

### 9.3 Performance cible

| **Indicateur**                                             | **Cible**                           |
|------------------------------------------------------------|-------------------------------------|
| **Chargement de la page d'accueil en 3G**                  | Moins de 3 secondes                 |
| **Poids d'une page hors médias**                           | Moins de 500 Ko                     |
| **Disponibilité hors maintenance planifiée**               | Supérieure à 99 %                   |
| **Envoi d'un formulaire (idée, signalement, commentaire)** | Confirmation en moins de 2 secondes |

### 9.4 Accessibilité

- Contrastes conformes aux recommandations d'accessibilité ;

- Texte alternatif sur toutes les images ;

- Navigation possible au clavier ;

- Taille de police confortable et agrandissable ;

- Zones cliquables suffisamment grandes pour un usage tactile.

### 9.5 Multilinguisme

La version initiale est en français. L'architecture technique doit prévoir l'ajout ultérieur de langues nationales, en particulier le bambara, sans refonte structurelle.

### 9.6 Compatibilité

- Navigateurs récents sur Android et iOS, ainsi que Chrome, Firefox et Edge sur ordinateur.

- Fonctionnement correct sur des téléphones d'entrée de gamme, aux capacités limitées.

## 10. Authentification, sécurité et protection des données

### 10.1 Authentification

- Deux rôles authentifiés uniquement : Administrateur IMPACT SAHEL et Porteur d'initiative ;

- Aucune inscription libre en ligne : les comptes porteurs sont créés exclusivement par un administrateur ;

- Connexion par identifiant (e-mail ou numéro de téléphone) et mot de passe ;

- Changement de mot de passe obligatoire à la première connexion d'un porteur ;

- Procédure de réinitialisation de mot de passe assurée par l'administrateur ;

- Authentification à deux facteurs recommandée pour les comptes administrateurs ;

- Déconnexion automatique après une période d'inactivité prolongée.

### 10.2 Protection des données personnelles

Le traitement des données personnelles devra être conforme à la loi n° 2013-015 du 21 mai 2013 portant protection des données à caractère personnel en République du Mali, modifiée en 2017, sous le contrôle de l'Autorité de Protection des Données à Caractère Personnel (APDP).

#### Principes applicables

- Minimisation : les citoyens ne fournissent aucune donnée obligatoire d'identification pour contribuer ;

- Les champs prénom et téléphone des formulaires citoyens sont facultatifs et clairement indiqués comme tels ;

- Les coordonnées éventuellement laissées par un citoyen ne sont accessibles qu'aux administrateurs et ne sont jamais publiées ;

- Politique de confidentialité accessible depuis chaque page, rédigée en langage simple ;

- Information claire, au moment du dépôt d'un formulaire, sur l'usage qui sera fait des données transmises.

### 10.3 Sécurité technique

- Connexion sécurisée HTTPS sur l'ensemble du site ;

- Mots de passe stockés sous forme chiffrée et non réversible ;

- Protection contre les injections, les scripts intersites et les envois massifs automatisés ;

- Contrôle du type et de la taille des fichiers déposés ;

- Sauvegardes automatisées et régulières, avec procédure de restauration testée ;

- Journal des actions d'administration (création de compte, suppression de contenu, modération).

## 11. Architecture technique

Les orientations ci-dessous cadrent les propositions des prestataires. Le choix technologique définitif reste ouvert, sous réserve du respect des exigences du présent document.

### 11.1 Approche

- Application web responsive développée en Progressive Web App, installable sur smartphone sans passage par un magasin d'applications ;

- Architecture découplée recommandée : interface d'une part, interface de programmation applicative et base de données d'autre part ;

- Technologies maintenables et pour lesquelles des compétences sont disponibles localement à Bamako ;

- Code source intégralement remis à IMPACT SAHEL, propriétaire de la solution.

### 11.2 Modèle de données — entités principales

| **Entité**                 | **Éléments structurants**                                                                                                                                                                                                                             |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Commune**                | Nom, quartiers, présentation, coordonnées de la mairie, horaires, services, coordonnées géographiques                                                                                                                                                 |
| **Utilisateur**            | Rôle (administrateur ou porteur), identifiants, coordonnées, commune, statut du compte                                                                                                                                                                |
| **Initiative**             | Titre, porteur, commune, domaine, description, bénéficiaires, état d'avancement, médias                                                                                                                                                               |
| **Publication**            | Type (actualité de commune ou actualité d'initiative), format (carrousel ou vidéo), auteur, commune, titre principal, méta description, image mise en avant, contenu enrichi, images du carrousel ou lien YouTube, statut (brouillon ou publié), date |
| **Commentaire**            | Publication rattachée, pseudonyme, message, date, statut de modération                                                                                                                                                                                |
| **Contribution citoyenne** | Type (idée ou signalement), commune, catégorie, contenu, photo, lieu, coordonnées facultatives, statut interne                                                                                                                                        |

> **Point d'attention pour le prestataire**
> • Le rattachement d'une publication à une commune est la clé de voûte du modèle : c'est lui qui alimente simultanément les espaces Ma Commune, Nos Initiatives et Actualités.
> • Une même publication ne doit jamais être dupliquée en base pour apparaître à plusieurs endroits.


### 11.3 Hébergement

- Hébergement fiable, avec sauvegardes automatisées ;

- Nom de domaine dédié, enregistré au nom d'IMPACT SAHEL ;

- Certificat de sécurité HTTPS ;

- Environnement de recette distinct de l'environnement de production.

### 11.4 Intégrations

- Carte interactive pour la localisation des communes et des mairies ;

- Lecteur vidéo YouTube intégré, en chargement différé ;

- Service d'envoi de courriers électroniques transactionnels, pour les notifications adressées aux administrateurs ;

- Partage vers WhatsApp, Facebook et autres réseaux sociaux ;

- Outil de mesure d'audience respectueux de la vie privée, alimentant le tableau de bord administrateur.

## 12. Tests et recette

### 12.1 Test d'usage auprès du public cible

Compte tenu de l'exigence de simplicité, un test d'usage est réalisé avant la mise en ligne, auprès d'un panel comprenant obligatoirement des personnes peu familières du numérique.

#### Protocole attendu

- Panel d'au moins dix personnes, dont plusieurs peu ou non scolarisées ;

- Tâches à réaliser sans aide : trouver sa commune, trouver les coordonnées de la mairie, signaler un problème, laisser un commentaire ;

- Mesure du taux de réussite et du temps nécessaire pour chaque tâche ;

- Correction des points de blocage identifiés avant la mise en ligne.

### 12.2 Test avec les porteurs d'initiatives

Les porteurs testent leur espace personnel : connexion, création de la fiche d'initiative, publication d'une actualité avec photo, consultation des commentaires.

### 12.3 Critères d'acceptation

| **Périmètre**                        | **Critère d'acceptation**                                                                                                                                                                                |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Navigation**                       | Une personne non familière du numérique trouve les informations de sa mairie en moins de trois clics et sans assistance.                                                                                 |
| **Ma Commune**                       | Le changement de commune met à jour l'ensemble de la page, y compris la carte, les actualités et les initiatives.                                                                                        |
| **Circulation des publications**     | Une actualité publiée par un porteur apparaît simultanément sur sa fiche d'initiative, sur la page Actualités et sur la page de sa commune.                                                              |
| **Publication au format carrousel**  | Un porteur publie depuis un smartphone une actualité comportant un titre, une méta description, une image mise en avant, un texte mis en forme et plusieurs photos défilantes, en moins de cinq minutes. |
| **Publication au format vidéo**      | Un lien YouTube saisi dans le formulaire est validé, prévisualisé, puis lu directement depuis la plateforme sans redirection.                                                                            |
| **Éditeur de texte enrichi**         | Un auteur applique du gras, de l'italique, une liste et insère une image dans le corps du texte sans connaissance technique préalable.                                                                   |
| **Image mise en avant**              | L'image mise en avant s'affiche dans toutes les listes, en tête de la page de détail et dans l'aperçu de partage WhatsApp.                                                                               |
| **Notification administrateur**      | Chaque idée et chaque signalement déclenche l'envoi d'un e-mail aux administrateurs, comportant un lien direct vers la contribution.                                                                     |
| **Absence de notification visiteur** | Aucun message n'est envoyé au citoyen après le dépôt d'une contribution ou d'un commentaire.                                                                                                             |
| **Commentaires**                     | Un visiteur non connecté dépose un commentaire qui s'affiche immédiatement.                                                                                                                              |
| **Contributions citoyennes**         | Un signalement envoyé apparaît dans la boîte de réception administrateur et n'est visible nulle part publiquement.                                                                                       |
| **Message de confirmation**          | Le message de remerciement s'affiche après chaque envoi d'idée ou de signalement, sans promesse de réponse.                                                                                              |
| **Tableau de bord administrateur**   | Tous les indicateurs de la section 6.6.1 sont affichés et les contributions sont exportables au format tableur.                                                                                          |
| **Performance**                      | La page d'accueil se charge en moins de trois secondes en connexion 3G simulée.                                                                                                                          |
| **Sécurité**                         | Aucune vulnérabilité critique ou majeure identifiée lors du test de sécurité préalable à la mise en production.                                                                                          |

## 13. Formation, livrables et maintenance

### 13.1 Formation

- Formation des administrateurs IMPACT SAHEL à l'ensemble des fonctions d'administration ;

- Formation des porteurs d'initiatives à l'usage de leur espace personnel, en session collective ;

- Supports de formation simples, illustrés de captures d'écran, utilisables en autonomie.

### 13.2 Livrables attendus

| **Livrable**                                                                                  | **Phase**     |
|-----------------------------------------------------------------------------------------------|---------------|
| **Maquettes UX/UI mobile puis desktop, validées avant développement**                         | Conception    |
| **Charte graphique appliquée aux couleurs de marque**                                         | Conception    |
| **Plateforme fonctionnelle : six espaces, formulaire de publication et modules transversaux** | Développement |
| **Back-office et tableaux de bord des deux rôles**                                            | Développement |
| **Fiches des communes renseignées et contenus initiaux intégrés**                             | Développement |
| **Code source complet et documentation technique**                                            | Développement |
| **Rapport du test d'usage et plan de correction**                                             | Recette       |
| **Guide administrateur et guide porteur d'initiative**                                        | Formation     |
| **Plateforme en production, domaine et hébergement actifs**                                   | Mise en ligne |
| **Rapports de maintenance périodiques**                                                       | Maintenance   |

### 13.3 Maintenance

Maintenance technique de douze mois à compter de la mise en ligne : correction des anomalies, mises à jour de sécurité, sauvegardes, assistance à l'équipe IMPACT SAHEL, petites améliorations.

> **À préciser dans l'offre**
> • Délai de prise en charge d'une anomalie bloquante (recommandé : 48 heures ouvrées).
> • Délai de prise en charge d'une anomalie non bloquante (recommandé : 5 jours ouvrés).
> • Canal et horaires du support.


## 14. Planning prévisionnel

Planning indicatif, à ajuster et contractualiser avec le prestataire retenu.

| **Phase**                         | **Contenu**                                                               | **Durée indicative**         |
|-----------------------------------|---------------------------------------------------------------------------|------------------------------|
| **1. Cadrage et conception**      | Ateliers, arborescence, maquettes mobile et desktop, validation graphique | 2 à 3 semaines               |
| **2. Développement**              | Six espaces, modules transversaux, back-office et tableaux de bord        | 6 à 8 semaines               |
| **3. Intégration des contenus**   | Fiches communes, initiatives, actualités de lancement                     | 1 à 2 semaines, en parallèle |
| **4. Tests et corrections**       | Test d'usage public cible, test porteurs, corrections                     | 2 semaines                   |
| **5. Formation et mise en ligne** | Formation des deux publics, remise des guides, mise en production         | 1 semaine                    |
| **6. Maintenance**                | Support, corrections, petites évolutions                                  | 12 mois                      |

## 15. Budget indicatif

Structure de budget à compléter par chaque prestataire dans son offre financière. Les montants ne sont pas fixés par IMPACT SAHEL.

| **Poste budgétaire**                                                    | **Montant proposé (FCFA)** |
|-------------------------------------------------------------------------|----------------------------|
| **Conception UX/UI et charte graphique**                                |                            |
| **Développement de l'interface publique**                               |                            |
| **Développement des espaces authentifiés et des tableaux de bord**      |                            |
| **Base de données et intégrations (carte, partage, mesure d'audience)** |                            |
| **Intégration des contenus initiaux**                                   |                            |
| **Hébergement et nom de domaine, première année**                       |                            |
| **Tests, recette et corrections**                                       |                            |
| **Formation et documentation**                                          |                            |
| **Maintenance technique, 12 mois**                                      |                            |
| **Gestion de projet**                                                   |                            |
| **TOTAL**                                                               |                            |

## 16. Évolutions futures

Les fonctionnalités suivantes ne font pas partie de la présente version. Elles sont mentionnées afin que l'architecture technique retenue permette leur ajout ultérieur sans refonte.

- Traduction en langues nationales, en priorité le bambara, avec restitution audio pour les personnes non lectrices ;

- Notifications par SMS ou WhatsApp à destination des porteurs d'initiatives ;

- Extension à d'autres communes et régions du Mali ;

- Candidatures en ligne aux futurs cycles d'incubation ;

- Application mobile native ;

- Ouverture de données et statistiques territoriales.

### 16.2 Vision

InnovSahel ne doit pas être seulement une plateforme qui parle des citoyens : elle doit être une plateforme qui permet aux citoyens d'agir.

> **« S'informer. Participer. Proposer. »**

En reliant les citoyens des communes de Bamako, les jeunes et femmes porteurs d'initiatives et l'équipe IMPACT SAHEL, la plateforme pose les bases d'un écosystème numérique citoyen malien, accessible, utile et extensible au-delà du projet Lab'Citoyen.

## 17. Modalités de réponse au cahier des charges

### 17.1 Contenu attendu de l'offre

- Note de compréhension du besoin, insistant sur la contrainte de simplicité d'usage ;

- Proposition technique détaillée : architecture, technologies, hébergement ;

- Premières intentions graphiques ou références de réalisations comparables ;

- Planning détaillé ;

- Offre financière détaillée selon la structure de la section 15 ;

- Présentation de l'équipe projet et de ses références ;

- Modalités de garantie et de maintenance après livraison.

### 17.2 Critères de sélection indicatifs

| **Critère**                                                                                  | **Pondération indicative** |
|----------------------------------------------------------------------------------------------|----------------------------|
| **Compréhension du besoin et capacité à concevoir pour un public peu familier du numérique** | 30 %                       |
| **Qualité technique et robustesse de l'architecture proposée**                               | 25 %                       |
| **Références sur des projets comparables**                                                   | 15 %                       |
| **Offre financière**                                                                         | 20 %                       |
| **Délai et qualité de l'accompagnement**                                                     | 10 %                       |

## Annexe — Glossaire

| **Terme**                    | **Définition**                                                                                                                                 |
|------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| **PWA**                      | Progressive Web App : site web qui s'installe et se comporte comme une application mobile, avec consultation partielle hors connexion.         |
| **Back-office**              | Interface d'administration réservée aux personnes autorisées, invisible du grand public.                                                       |
| **Mobile-first**             | Méthode de conception qui traite l'écran de smartphone en priorité, avant les autres supports.                                                 |
| **Modération a posteriori**  | Contrôle des contenus après leur publication, par opposition à une validation préalable.                                                       |
| **Recette**                  | Phase de vérification que la plateforme livrée est conforme au cahier des charges, avant validation finale.                                    |
| **Éditeur de texte enrichi** | Zone de saisie permettant de mettre en forme le texte (gras, italique, listes, images) en voyant directement le résultat, sans écrire de code. |
| **Méta description**         | Résumé court d'une publication, utilisé comme extrait dans les listes, dans les aperçus de partage et par les moteurs de recherche.            |
| **Image mise en avant**      | Image de couverture d'une publication, affichée en premier dans les listes et en tête de la page de détail.                                    |
| **APDP**                     | Autorité de Protection des Données à Caractère Personnel du Mali.                                                                              |
