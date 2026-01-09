# Architecture ArmoireCheck

Ce document décrit l'architecture technique du projet ArmoireCheck.

## Vue d'ensemble

ArmoireCheck est une application web full-stack qui permet de gérer des armoires à outils et de détecter les outils manquants grâce à la reconnaissance d'images.

```
┌─────────────────┐
│   Utilisateur   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│    Frontend     │────▶│   Clerk Auth     │
│  (React + MUI)  │     └──────────────────┘
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐     ┌──────────────────┐
│     Backend     │────▶│   PostgreSQL     │
│  (Node/Express) │     │     (Neon)       │
└─────────────────┘     └──────────────────┘
```

## Technologies utilisées

### Frontend (Client)

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.2+ | Framework UI |
| Material-UI | 5.14+ | Composants UI |
| TensorFlow.js | 4.10+ | Reconnaissance d'images |
| Axios | 1.6+ | Appels HTTP |
| React Router | 6.21+ | Navigation |
| Clerk | 5.59+ | Authentification |

### Backend (Serveur)

| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 16+ | Runtime JavaScript |
| Express | 4.18+ | Framework web |
| PostgreSQL | 15+ | Base de données |
| JWT | 9.0+ | Tokens d'authentification |
| bcrypt | 5.1+ | Hachage mots de passe |

### DevOps

| Technologie | Usage |
|-------------|-------|
| Docker | Conteneurisation |
| Docker Compose | Orchestration locale |
| GitHub Actions | CI/CD |
| Vercel | Hébergement frontend |
| Railway/Heroku | Hébergement backend |
| Neon | Base de données cloud |

## Architecture détaillée

### Frontend

```
frontend/
├── src/
│   ├── index.js              # Point d'entrée React
│   ├── App.js                # Composant racine + routing
│   │
│   ├── components/           # Composants réutilisables
│   │   └── Navbar.js         # Barre de navigation
│   │
│   ├── pages/                # Pages de l'application
│   │   ├── HomePage.js       # Page d'accueil
│   │   ├── LoginPage.js      # Connexion
│   │   ├── SignUpPage.js     # Inscription
│   │   ├── CabinetListPage.js    # Liste armoires
│   │   ├── CabinetDetailPage.js  # Détails armoire
│   │   ├── CheckPage.js      # Vérification
│   │   └── AdminPage.js      # Panel admin
│   │
│   └── services/             # Services métier
│       ├── api.js            # Client API REST
│       └── imageRecognition.js   # IA reconnaissance
│
└── public/                   # Assets statiques
```

#### Flow de données Frontend

```
User Action
    ↓
React Component
    ↓
Service Layer (api.js)
    ↓
Axios HTTP Client
    ↓
Backend API
    ↓
Response
    ↓
Component State Update
    ↓
UI Re-render
```

### Backend

```
backend/
├── src/
│   ├── index.js              # Serveur Express
│   │   ├── Routes            # Définition des endpoints
│   │   ├── Middlewares       # Chaîne de traitement
│   │   └── Database Pool     # Connexion PostgreSQL
│   │
│   └── middleware/
│       ├── errorHandler.js   # Gestion erreurs
│       └── logger.js         # Logging
│
├── database/
│   ├── init.sql              # Schéma BDD
│   └── seed.sql              # Données test
│
└── logs/                     # Logs applicatifs
```

#### Flow de requête Backend

```
HTTP Request
    ↓
Express App
    ↓
CORS Middleware
    ↓
Request Logger
    ↓
JSON Parser
    ↓
Authentication (si requis)
    ↓
Authorization (si requis)
    ↓
Route Handler
    ↓
Database Query
    ↓
Response Formatter
    ↓
Error Handler (si erreur)
    ↓
Response Logger
    ↓
HTTP Response
```

## Base de données

### Schéma relationnel

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │
│ username    │◄──────┐
│ email       │       │
│ password_hash│      │
│ role        │       │
└─────────────┘       │
                      │
                      │ user_id (FK)
                      │
┌─────────────┐       │       ┌──────────────┐
│  cabinets   │       │       │    checks    │
│─────────────│       │       │──────────────│
│ id (PK)     │◄──────┼───────│ id (PK)      │
│ name        │       │       │ cabinet_id(FK)│
│ description │       └───────│ user_id (FK) │
│ location    │               │ check_date   │
│ image_url   │               │ status       │
└──────┬──────┘               │ image_url    │
       │                      │ notes        │
       │ cabinet_id (FK)      └──────┬───────┘
       │                             │
       ▼                             │ check_id (FK)
┌─────────────┐                      │
│    tools    │                      ▼
│─────────────│               ┌──────────────┐
│ id (PK)     │◄──────────────│missing_tools │
│ cabinet_id  │  tool_id (FK) │──────────────│
│ name        │               │ id (PK)      │
│ description │               │ check_id (FK)│
│ quantity    │               │ tool_id (FK) │
│ status      │               └──────────────┘
│ position_x  │
│ position_y  │
└─────────────┘
```

### Tables principales

#### users
Stocke les utilisateurs avec rôles (admin/user)

#### cabinets
Armoires à outils avec images de référence

#### tools
Outils contenus dans les armoires avec positions

#### checks
Vérifications effectuées sur les armoires

#### missing_tools
Liaison entre vérifications et outils manquants

## Sécurité

### Authentification

1. **Inscription** :
   ```
   User → Frontend → POST /api/users → Backend
   ↓
   Validate input
   ↓
   Hash password (bcrypt, 10 rounds)
   ↓
   Store in database
   ↓
   Return user (sans password)
   ```

2. **Connexion** :
   ```
   User → Frontend → POST /api/login → Backend
   ↓
   Find user by username
   ↓
   Compare password (bcrypt)
   ↓
   Generate JWT token (24h expiry)
   ↓
   Return token + user data
   ↓
   Store token in localStorage
   ```

3. **Requêtes authentifiées** :
   ```
   Frontend → Add Authorization header → Backend
   ↓
   Extract token
   ↓
   Verify JWT signature
   ↓
   Decode user info
   ↓
   Attach to req.user
   ↓
   Process request
   ```

### Middlewares de sécurité

- **CORS** : Autorise uniquement les origines définies
- **Helmet** : Headers de sécurité HTTP
- **Rate limiting** : Protection contre force brute (à implémenter)
- **Input validation** : Validation de toutes les entrées
- **SQL injection** : Requêtes préparées avec pg

## Reconnaissance d'images

### Pipeline de détection

```
1. Capture Image
   ↓
2. Preprocessing
   - Resize to 224x224
   - Normalize pixels (-1 to 1)
   ↓
3. Comparison with Reference
   - Pixel-by-pixel difference
   - Calculate similarity score
   ↓
4. Difference Map
   - Divide image into grid (8x8)
   - Detect significant changes
   ↓
5. Tool Detection
   - Match difference regions with tool positions
   - Calculate confidence scores
   ↓
6. Results
   - List of missing tools
   - Confidence score
   - Visual difference map
```

### Algorithme de comparaison

```javascript
// Étape 1: Charger les images
referenceImage = loadImage(referenceUrl)
currentImage = loadImage(currentUrl)

// Étape 2: Convertir en tensors
refTensor = imageToTensor(referenceImage)
curTensor = imageToTensor(currentImage)

// Étape 3: Calculer la différence
diff = abs(refTensor - curTensor)
similarity = 1 - mean(diff)

// Étape 4: Détecter les régions
grid = divideIntoGrid(diff, 8, 8)
regions = findDifferenceRegions(grid, threshold=0.3)

// Étape 5: Identifier les outils manquants
missingTools = []
for each tool in tools:
    if toolPosition overlaps regions:
        missingTools.add(tool)

return {
    similarity,
    missingTools,
    regions
}
```

## Performance

### Optimisations Backend

- **Index database** : Sur colonnes fréquemment requêtées
- **Connection pooling** : Réutilisation des connexions PostgreSQL
- **Gzip compression** : Réduction taille réponses
- **Caching** : Headers de cache appropriés

### Optimisations Frontend

- **Code splitting** : Chargement lazy des routes
- **Image optimization** : Compression et formats modernes
- **Memoization** : React.memo pour composants
- **Virtual scrolling** : Pour grandes listes

### Monitoring

- **Logs** : Rotation automatique tous les jours
- **Health checks** : Endpoints de santé
- **Error tracking** : Logs centralisés
- **Metrics** : À implémenter (Prometheus/Grafana)

## Scalabilité

### Horizontal Scaling

```
┌─────────────┐
│   Load      │
│  Balancer   │
└──────┬──────┘
       │
       ├──────┐
       │      │
       ▼      ▼
   ┌────┐  ┌────┐
   │API │  │API │  Backend instances
   │ 1  │  │ 2  │
   └─┬──┘  └─┬──┘
     │      │
     └──┬───┘
        ▼
   ┌─────────┐
   │   DB    │
   │  Pool   │
   └────┬────┘
        ▼
   ┌─────────┐
   │PostgreSQL│
   └─────────┘
```

### Améliorations futures

- **Redis cache** : Cache des requêtes fréquentes
- **CDN** : Distribution des assets statiques
- **Queue system** : Pour traitement asynchrone
- **Microservices** : Séparer reconnaissance d'images
- **Read replicas** : Pour lecture base de données

## CI/CD Pipeline

```
Code Push → GitHub
    ↓
GitHub Actions Trigger
    ↓
┌─────────────────────┐
│  Backend Tests      │
│  - Unit tests       │
│  - Integration tests│
│  - Linting          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Frontend Tests     │
│  - Component tests  │
│  - Build test       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Docker Build       │
│  - Backend image    │
│  - Frontend image   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Security Scan      │
│  - Trivy scan       │
│  - Dependencies     │
└──────────┬──────────┘
           │
           ▼ (if main/master)
┌─────────────────────┐
│   Deploy            │
│  - Vercel (Frontend)│
│  - Railway (Backend)│
└─────────────────────┘
```

## Environnements

### Développement
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Database: Local PostgreSQL ou Neon

### Production
- Frontend: Vercel (https://armoirecheck.vercel.app)
- Backend: Railway (https://api.armoirecheck.com)
- Database: Neon PostgreSQL

## Documentation complémentaire

- [README.md](README.md) : Guide général
- [QUICKSTART.md](QUICKSTART.md) : Démarrage rapide
- [DOCKER.md](DOCKER.md) : Guide Docker
- [CONTRIBUTING.md](CONTRIBUTING.md) : Guide de contribution
- [Backend README](backend/README.md) : Documentation backend
- [Frontend README](frontend/README.md) : Documentation frontend
