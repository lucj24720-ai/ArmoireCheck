# ArmoireCheck

Une application moderne pour gérer et contrôler les outils dans une armoire. Cette application permet de détecter les outils manquants après utilisation en utilisant la reconnaissance d'images.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Déploiement](#déploiement)
- [Tests](#tests)
- [Contribution](#contribution)
- [Licence](#licence)

## Fonctionnalités

### Pour tous les utilisateurs
- **Authentification sécurisée** : Système de login avec JWT et Clerk
- **Visualisation des armoires** : Parcourir les armoires disponibles
- **Vérification des outils** : Scanner une armoire pour détecter les outils manquants
- **Historique** : Consulter l'historique des vérifications

### Pour les administrateurs
- **Gestion des armoires** : Ajouter, modifier et supprimer des armoires
- **Gestion des outils** : Définir les outils et leur position dans chaque armoire
- **Gestion des utilisateurs** : Créer et gérer les comptes utilisateurs
- **Tableau de bord** : Vue d'ensemble des statistiques et activités

### Reconnaissance d'images
- **Détection automatique** : Compare l'image actuelle avec une image de référence
- **Zones de différence** : Identifie précisément les zones où des outils manquent
- **Score de confiance** : Indique le niveau de certitude de la détection
- **TensorFlow.js** : Utilise l'intelligence artificielle pour l'analyse d'images

## Technologies

### Backend
- **Node.js** v16+ avec Express.js
- **PostgreSQL** (Neon Database) pour le stockage des données
- **JWT** pour l'authentification
- **bcrypt** pour le hachage des mots de passe
- **CORS** pour la gestion des requêtes cross-origin

### Frontend
- **React.js** 18+ avec JavaScript
- **Material-UI (MUI)** pour l'interface utilisateur
- **Clerk** pour l'authentification avancée
- **TensorFlow.js** pour la reconnaissance d'images
- **Axios** pour les appels API
- **React Router** pour la navigation

### DevOps
- **Vercel** pour le déploiement du frontend
- **Heroku/Railway** recommandé pour le backend
- **Neon** pour la base de données PostgreSQL cloud

## Architecture

```
ArmoireCheck/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Point d'entrée du serveur
│   │   └── middleware/
│   │       ├── errorHandler.js      # Gestion centralisée des erreurs
│   │       └── logger.js            # Système de logging
│   ├── database/
│   │   ├── init.sql                 # Script d'initialisation de la BDD
│   │   └── seed.sql                 # Données de test
│   ├── logs/                        # Fichiers de logs (généré)
│   ├── .env                         # Variables d'environnement
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js                   # Composant principal
    │   ├── index.js                 # Point d'entrée React
    │   ├── components/
    │   │   └── Navbar.js            # Barre de navigation
    │   ├── pages/
    │   │   ├── HomePage.js          # Page d'accueil
    │   │   ├── LoginPage.js         # Page de connexion
    │   │   ├── SignUpPage.js        # Page d'inscription
    │   │   ├── CabinetListPage.js   # Liste des armoires
    │   │   ├── CabinetDetailPage.js # Détails d'une armoire
    │   │   ├── CheckPage.js         # Page de vérification
    │   │   └── AdminPage.js         # Panel administrateur
    │   └── services/
    │       ├── api.js               # Service API centralisé
    │       └── imageRecognition.js  # Service de reconnaissance d'images
    ├── public/
    ├── .env                         # Variables d'environnement
    └── package.json
```

## Installation

### 🚀 Démarrage Rapide (5 minutes)

**NOUVEAU !** Suivez notre guide de démarrage ultra-rapide:

📖 **[DEMARRAGE_RAPIDE.md](DEMARRAGE_RAPIDE.md)** - Installation en 5 étapes simples

ou

📖 **[GUIDE_NEON.md](GUIDE_NEON.md)** - Guide détaillé avec captures d'écran

### Prérequis
- Node.js v16 ou supérieur
- npm ou yarn
- **RECOMMANDÉ**: Compte [Neon](https://neon.tech) (PostgreSQL cloud gratuit)
- Compte Clerk (optionnel, pour l'authentification avancée)

### 1. Cloner le dépôt

```bash
git clone https://github.com/lucj24720-ai/ArmoireCheck.git
cd ArmoireCheck
```

### 2. Installation du Backend

```bash
cd backend
npm install
```

### 3. Installation du Frontend

```bash
cd ../frontend
npm install
```

## Configuration

### Configuration du Backend

1. Créer un fichier `.env` dans le dossier `backend/` :

```env
# Base de données PostgreSQL
DATABASE_URL=postgres://user:password@host:5432/armoirecheck

# Clé secrète JWT (générer une clé aléatoire sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire

# Port du serveur
PORT=5001

# Environnement (development ou production)
NODE_ENV=development
```

2. Configurer la base de données Neon :
   - Créer un compte sur [Neon](https://neon.tech)
   - Créer un nouveau projet
   - Copier la chaîne de connexion dans `DATABASE_URL`

3. Initialiser la base de données :

```bash
# Se connecter à PostgreSQL et exécuter les scripts
psql $DATABASE_URL -f database/init.sql

# Optionnel : Ajouter des données de test
psql $DATABASE_URL -f database/seed.sql
```

### Configuration du Frontend

1. Créer un fichier `.env` dans le dossier `frontend/` :

```env
# URL de l'API backend
REACT_APP_API_URL=http://localhost:5001/api

# Clé publique Clerk
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_votre_cle_clerk
```

2. Configurer Clerk :
   - Créer un compte sur [Clerk](https://clerk.com)
   - Créer une nouvelle application
   - Copier la clé publique dans `REACT_APP_CLERK_PUBLISHABLE_KEY`

## Utilisation

### Démarrage en mode développement

1. **Démarrer le backend** :

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5001`

2. **Démarrer le frontend** :

```bash
cd frontend
npm start
```

L'application démarre sur `http://localhost:3000`

### Comptes de test (après seed.sql)

- **Administrateur**
  - Username: `admin`
  - Password: `admin123`

- **Utilisateur**
  - Username: `user1`
  - Password: `user123`

### Workflow d'utilisation

1. **Connexion** : Se connecter avec un compte utilisateur ou admin
2. **Voir les armoires** : Naviguer vers la liste des armoires
3. **Sélectionner une armoire** : Cliquer sur une armoire pour voir ses détails
4. **Vérification** : Cliquer sur "Vérifier" et prendre une photo de l'armoire
5. **Résultats** : Le système détecte automatiquement les outils manquants
6. **Historique** : Consulter l'historique des vérifications

## API Documentation

### Authentification

#### POST /api/login
Connexion d'un utilisateur

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@armoirecheck.com",
    "role": "admin"
  }
}
```

### Armoires (Cabinets)

#### GET /api/cabinets
Récupérer toutes les armoires (Public)

#### GET /api/cabinets/:id
Récupérer une armoire spécifique (Public)

#### POST /api/cabinets
Créer une nouvelle armoire (Admin uniquement)

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Armoire Atelier",
  "description": "Outils de base",
  "location": "Atelier - Zone A",
  "image_url": "https://..."
}
```

#### PUT /api/cabinets/:id
Mettre à jour une armoire (Admin uniquement)

#### DELETE /api/cabinets/:id
Supprimer une armoire (Admin uniquement)

### Outils (Tools)

#### GET /api/cabinets/:id/tools
Récupérer les outils d'une armoire

#### GET /api/tools
Récupérer tous les outils

#### POST /api/tools
Ajouter un outil (Admin uniquement)

**Body:**
```json
{
  "cabinetId": 1,
  "name": "Marteau",
  "description": "Marteau de charpentier 500g",
  "quantity": 2,
  "image_url": "https://...",
  "position_x": 0.1,
  "position_y": 0.2,
  "position_width": 0.15,
  "position_height": 0.1
}
```

### Vérifications (Checks)

#### POST /api/checks
Créer une vérification (Authentifié)

**Body:**
```json
{
  "cabinetId": 1,
  "image": "base64_image_data",
  "missingTools": [1, 3],
  "notes": "Marteau et tournevis manquants"
}
```

#### GET /api/cabinets/:id/checks
Récupérer les vérifications d'une armoire

#### GET /api/checks/:id
Récupérer les détails d'une vérification

## Déploiement

### Déploiement du Frontend sur Vercel

1. Installer Vercel CLI :
```bash
npm install -g vercel
```

2. Se connecter à Vercel :
```bash
vercel login
```

3. Déployer :
```bash
cd frontend
vercel
```

4. Configurer les variables d'environnement sur Vercel :
   - `REACT_APP_API_URL` : URL de votre backend en production
   - `REACT_APP_CLERK_PUBLISHABLE_KEY` : Clé Clerk

### Déploiement du Backend sur Railway

1. Créer un compte sur [Railway](https://railway.app)
2. Créer un nouveau projet
3. Connecter votre repository GitHub
4. Configurer les variables d'environnement
5. Railway détecte automatiquement Node.js et déploie

### Configuration de la base de données Neon

La base de données Neon est déjà en cloud, il suffit de :
1. Utiliser la même `DATABASE_URL` en production
2. Exécuter les scripts d'initialisation si ce n'est pas déjà fait
3. Configurer le SSL si nécessaire

## Tests

### Tests Backend

```bash
cd backend
npm test
```

### Tests Frontend

```bash
cd frontend
npm test
```

## Structure de la base de données

- **users** : Utilisateurs de l'application
- **cabinets** : Armoires à outils
- **tools** : Outils contenus dans les armoires
- **checks** : Vérifications effectuées
- **missing_tools** : Outils manquants détectés lors des vérifications

## Sécurité

- Mots de passe hashés avec bcrypt (10 rounds)
- Authentification JWT avec expiration de 24h
- Validation des entrées côté backend
- Protection CORS configurée
- Accès admin restreint pour les opérations sensibles

## Performance

- Logging optimisé avec rotation automatique des fichiers
- Index sur les colonnes fréquemment requêtées
- Gestion des erreurs centralisée
- Timeouts configurés pour les requêtes API

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Roadmap

- [ ] Ajouter des notifications en temps réel
- [ ] Améliorer le modèle de reconnaissance d'images
- [ ] Ajouter un système de rapports PDF
- [ ] Application mobile (React Native)
- [ ] Support multi-langues
- [ ] Dashboard avec statistiques avancées

## Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Développé avec ❤️ par l'équipe ArmoireCheck