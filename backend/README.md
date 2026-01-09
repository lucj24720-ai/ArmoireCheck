# ArmoireCheck Backend

API REST pour la gestion des armoires à outils et la détection d'outils manquants.

## Configuration rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

### 3. Base de données

Initialiser la base de données PostgreSQL :

```bash
# Avec psql
psql $DATABASE_URL -f database/init.sql

# Ajouter des données de test (optionnel)
psql $DATABASE_URL -f database/seed.sql
```

### 4. Démarrage

```bash
# Mode développement avec nodemon
npm run dev

# Mode production
npm start
```

## Structure des dossiers

```
backend/
├── src/
│   ├── index.js              # Point d'entrée principal
│   └── middleware/
│       ├── errorHandler.js   # Gestion des erreurs
│       └── logger.js         # Système de logging
├── database/
│   ├── init.sql             # Schéma de la base de données
│   └── seed.sql             # Données de test
├── logs/                    # Fichiers de logs (auto-généré)
├── .env                     # Variables d'environnement (ne pas commiter)
├── .env.example             # Template des variables d'environnement
└── package.json
```

## API Endpoints

### Authentification

- `POST /api/login` - Connexion
- `POST /api/users` - Inscription (création d'utilisateur)

### Armoires

- `GET /api/cabinets` - Liste des armoires
- `GET /api/cabinets/:id` - Détails d'une armoire
- `POST /api/cabinets` - Créer une armoire (admin)
- `PUT /api/cabinets/:id` - Modifier une armoire (admin)
- `DELETE /api/cabinets/:id` - Supprimer une armoire (admin)

### Outils

- `GET /api/tools` - Liste de tous les outils
- `GET /api/cabinets/:id/tools` - Outils d'une armoire
- `GET /api/tools/:id` - Détails d'un outil
- `POST /api/tools` - Créer un outil (admin)
- `PUT /api/tools/:id` - Modifier un outil (admin)
- `DELETE /api/tools/:id` - Supprimer un outil (admin)

### Vérifications

- `POST /api/checks` - Créer une vérification (authentifié)
- `GET /api/cabinets/:id/checks` - Historique des vérifications
- `GET /api/checks/:id` - Détails d'une vérification

### Utilisateurs

- `GET /api/users` - Liste des utilisateurs (admin)
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur (admin)

## Sécurité

- Authentification JWT avec expiration
- Hachage des mots de passe avec bcrypt
- Validation des entrées
- Protection contre les injections SQL
- CORS configuré

## Logging

Les logs sont automatiquement générés dans le dossier `logs/` :
- `app-YYYY-MM-DD.log` : Tous les logs
- `error-YYYY-MM-DD.log` : Erreurs uniquement

Les logs sont automatiquement supprimés après 30 jours.

## Gestion des erreurs

Le système inclut une gestion centralisée des erreurs avec :
- Codes d'erreur HTTP appropriés
- Messages d'erreur clairs
- Stack traces en développement
- Logging automatique des erreurs

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgres://user:pass@host:5432/db` |
| `JWT_SECRET` | Clé secrète pour JWT | `une_cle_tres_longue_et_aleatoire` |
| `PORT` | Port du serveur | `5001` |
| `NODE_ENV` | Environnement | `development` ou `production` |

## Déploiement

### Railway

1. Créer un compte sur Railway
2. Connecter le repository
3. Ajouter les variables d'environnement
4. Railway déploie automatiquement

### Heroku

```bash
heroku create armoirecheck-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=votre_cle_secrete
git push heroku main
```

## Scripts npm

- `npm start` - Démarrer en production
- `npm run dev` - Démarrer en développement avec nodemon
- `npm test` - Lancer les tests (à implémenter)

## Base de données

### Tables principales

- `users` - Utilisateurs
- `cabinets` - Armoires
- `tools` - Outils
- `checks` - Vérifications
- `missing_tools` - Outils manquants

### Migrations

Les scripts SQL dans `database/` doivent être exécutés dans l'ordre :
1. `init.sql` - Création des tables
2. `seed.sql` - Données de test (optionnel)
