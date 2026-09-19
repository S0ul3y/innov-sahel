# InnovSahel — BackEnd

**API REST NestJS** pour la plateforme citoyenne InnovSahel du District de Bamako.
Développé pour **IMPACT SAHEL** dans le cadre du projet **Lab'Citoyen**.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | **NestJS 10** (TypeScript) |
| ORM | **TypeORM** |
| Base de données | **MySQL** (dev / phpMyAdmin) → **PostgreSQL** (prod) |
| Authentification | **JWT** (access 1h + refresh 7j) |
| Validation | class-validator + class-transformer |
| Documentation | **Swagger UI** (`/api/docs`) |
| Emails | **Nodemailer** |
| Hash | **bcrypt** (12 rounds) |

---

## Architecture

```
src/
├── common/              # Guards, Decorators, Filters (partagés)
│   ├── decorators/      # @Roles, @RequireAdminLevel, @CurrentUser
│   ├── guards/          # JwtAuthGuard, RolesGuard, AdminLevelGuard
│   ├── filters/         # HttpExceptionFilter
│   ├── interceptors/    # LoggingInterceptor
│   └── enums/           # Role, AdminLevel
├── config/              # database, jwt, mail configs
├── database/            # seed.ts
└── modules/
    ├── auth/            # Login, JWT, change-password, reset-password
    ├── users/           # CRUD comptes porteurs
    ├── communes/        # 6 communes du District
    ├── initiatives/     # Fiches d'initiatives
    ├── publications/    # Actualités (commune + initiative)
    ├── comments/        # Commentaires publics + modération
    ├── contributions/   # Idées & signalements + export CSV
    ├── dashboard/       # Statistiques admin
    └── notifications/   # Emails Nodemailer
```

---

## Séparation des responsabilités des 2 admins

| Fonctionnalité | Admin Principal | Admin Suivi |
|---|:-:|:-:|
| Créer / supprimer comptes porteurs | ✅ | ❌ |
| Réinitialiser mot de passe porteur | ✅ | ❌ |
| Gérer fiches communes | ✅ | ❌ |
| Créer / modifier / supprimer publications | ✅ | ✅ |
| Modérer commentaires | ✅ | ✅ |
| Traiter contributions (statut + notes) | ✅ | ✅ |
| Exporter contributions CSV | ✅ | ✅ |
| Voir tableau de bord | ✅ | ✅ |

**Implémentation :** `@RequireAdminLevel(AdminLevel.PRINCIPAL)` + `AdminLevelGuard`

---

## Démarrage rapide

### 1. Prérequis

- **Node.js 20+**
- **npm 10+**

### 2. Installation

```bash
cd BackEnd
npm install
```

### 3. Configuration

```bash
cp .env.example .env
# Éditez .env avec vos valeurs (JWT_SECRET, MAIL_*, etc.)
```

### 4. Seed de la base de données

Crée les 2 comptes admin et les 6 communes :

```bash
npm run seed
```

### 5. Lancer le serveur (développement)

```bash
npm run start:dev
```

→ API : **http://localhost:3001/api**
→ Swagger : **http://localhost:3001/api/docs**

---

## Endpoints principaux

### Auth
| Méthode | Route | Accès |
|---------|-------|-------|
| `POST` | `/api/auth/login` | PUBLIC |
| `POST` | `/api/auth/refresh` | PUBLIC |
| `GET` | `/api/auth/me` | JWT |
| `POST` | `/api/auth/change-password` | JWT |
| `POST` | `/api/auth/reset-password/:id` | Admin Principal |

### Users (porteurs)
| Méthode | Route | Accès |
|---------|-------|-------|
| `GET` | `/api/users` | ADMIN |
| `POST` | `/api/users` | Admin Principal |
| `PATCH` | `/api/users/:id` | ADMIN ou propriétaire |
| `DELETE` | `/api/users/:id` | Admin Principal |
| `PATCH` | `/api/users/:id/status` | Admin Principal |

### Communes
| Méthode | Route | Accès |
|---------|-------|-------|
| `GET` | `/api/communes` | PUBLIC |
| `GET` | `/api/communes/:id` | PUBLIC |
| `PATCH` | `/api/communes/:id` | Admin Principal |

### Initiatives, Publications, Comments
> Routes publiques (GET) + routes protégées (POST/PATCH/DELETE)
> Voir la documentation Swagger complète : `/api/docs`

### Contributions
| Méthode | Route | Accès |
|---------|-------|-------|
| `POST` | `/api/contributions` | PUBLIC |
| `GET` | `/api/contributions` | ADMIN |
| `GET` | `/api/contributions/export` | ADMIN (CSV) |
| `PATCH` | `/api/contributions/:id/status` | ADMIN |

### Dashboard
| Méthode | Route | Accès |
|---------|-------|-------|
| `GET` | `/api/dashboard/stats` | ADMIN |

---

## Production (PostgreSQL)

Modifiez `.env` :

```env
NODE_ENV=production
DB_TYPE=postgres
DB_HOST=votre-serveur-pg
DB_PORT=5432
DB_USER=innovsahel_user
DB_PASSWORD=MotDePasseSecurisé
DB_DATABASE=innovsahel_db
JWT_SECRET=SecretComplexe64CaractèresMinimum
```

```bash
npm run build
npm run start:prod
```

---

## Sécurité

- Mots de passe hashés **bcrypt** (12 rounds)
- Tokens JWT **RS256** avec expiration courte (1h)
- **Rate limiting** : 100 req/min par IP
- **CORS** configuré sur `FRONTEND_URL`
- Données citoyennes (nom, téléphone) masquées dans les réponses publiques (`select: false`)
- IP des commentateurs hashée **SHA-256** (jamais stockée en clair)
- Filtre anti-injection via `class-validator` (whitelist strict)
- Sanitisation HTML côté service via `sanitize-html`
