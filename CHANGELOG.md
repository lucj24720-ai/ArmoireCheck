# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.0] - 2026-01-09

### Ajouts

#### Backend
- **Middleware de gestion d'erreurs centralisé** (`middleware/errorHandler.js`)
  - Classe `ApiError` pour les erreurs personnalisées
  - Types d'erreurs prédéfinis (BAD_REQUEST, UNAUTHORIZED, etc.)
  - Gestion automatique des erreurs PostgreSQL
  - Support des erreurs JWT
  - Messages d'erreur clairs et cohérents

- **Système de logging avancé** (`middleware/logger.js`)
  - Logging de toutes les requêtes HTTP avec timing
  - Fichiers de logs séparés par jour
  - Logs d'erreur dans un fichier dédié
  - Rotation automatique (suppression après 30 jours)
  - Niveaux de log : ERROR, WARN, INFO, DEBUG
  - Format JSON pour faciliter l'analyse

- **Scripts SQL d'initialisation**
  - `database/init.sql` : Schéma complet de la base de données
  - `database/seed.sql` : Données de test avec 3 armoires et leurs outils
  - Triggers pour mise à jour automatique des timestamps
  - Index pour améliorer les performances
  - Commentaires sur toutes les tables

#### Frontend
- **Service API centralisé** (`services/api.js`)
  - Instance Axios configurée avec intercepteurs
  - Gestion automatique de l'authentification
  - Déconnexion automatique si token expiré
  - Gestion des erreurs réseau
  - Services organisés par domaine (auth, cabinet, tool, check, user)

- **Service de reconnaissance d'images** (`services/imageRecognition.js`)
  - Intégration TensorFlow.js
  - Comparaison d'images pixel par pixel
  - Détection des zones de différence
  - Calcul de score de confiance
  - Identification des outils manquants par position
  - Gestion efficace de la mémoire

#### Documentation
- **README principal amélioré**
  - Table des matières complète
  - Documentation détaillée de l'architecture
  - Instructions d'installation pas à pas
  - Documentation complète de l'API
  - Guide de déploiement
  - Informations de sécurité et performance

- **README Backend** (`backend/README.md`)
  - Configuration rapide
  - Liste complète des endpoints
  - Documentation des middlewares
  - Guide de déploiement

- **README Frontend** (`frontend/README.md`)
  - Structure des dossiers
  - Guide d'utilisation des services
  - Documentation des composants
  - Troubleshooting

- **Guide de démarrage rapide** (`QUICKSTART.md`)
  - Installation en 5 étapes
  - Comptes de test
  - Dépannage rapide

- **Guide de contribution** (`CONTRIBUTING.md`)
  - Standards de code
  - Processus de développement
  - Convention de commits
  - Checklist de PR

- **Script d'installation** (`setup.sh`)
  - Installation automatique
  - Configuration interactive
  - Initialisation de la base de données

#### Configuration
- **Fichiers d'exemple d'environnement**
  - `backend/.env.example` : Template pour le backend
  - `frontend/.env.example` : Template pour le frontend
  - Documentation de chaque variable

- **.gitignore amélioré**
  - Exclusion des logs
  - Exclusion des fichiers de build
  - Exclusion des configurations locales

### Modifications

#### Backend
- Intégration des nouveaux middlewares dans `index.js`
  - Logger de requêtes
  - Logger d'erreurs
  - Gestionnaire d'erreurs 404
  - Gestionnaire d'erreurs global
- Gestion des erreurs non capturées (unhandledRejection, uncaughtException)
- Logs au démarrage avec informations de configuration

#### Frontend
- Configuration Clerk mise à jour
- Support du nouveau service API
- Préparation pour la reconnaissance d'images

### Améliorations

#### Sécurité
- Validation des entrées côté backend
- Gestion sécurisée des erreurs (pas de stack trace en production)
- Protection contre les injections SQL avec paramètres préparés
- Hachage bcrypt des mots de passe (10 rounds)

#### Performance
- Index sur les colonnes fréquemment requêtées
- Logging optimisé avec rotation
- Timeouts configurés pour les requêtes API
- Gestion efficace de la mémoire TensorFlow.js

#### Maintenabilité
- Code modulaire et organisé
- Documentation complète
- Standards de code définis
- Tests facilités avec données de seed

## [1.0.0] - 2024-12-17

### Ajouts initiaux

#### Backend
- API REST avec Express.js
- Authentification JWT
- Connexion à PostgreSQL (Neon)
- CRUD pour armoires, outils, utilisateurs
- Système de vérification

#### Frontend
- Application React avec Material-UI
- Authentification avec Clerk
- Pages : Home, Login, SignUp, Cabinets, Admin, Check
- Navigation avec React Router
- Thème personnalisé

#### Base de données
- Tables : users, cabinets, tools, checks, missing_tools
- Relations avec clés étrangères
- Contraintes de validation

---

## Types de changements

- `Ajouts` : Nouvelles fonctionnalités
- `Modifications` : Changements de fonctionnalités existantes
- `Dépréciations` : Fonctionnalités bientôt supprimées
- `Suppressions` : Fonctionnalités supprimées
- `Corrections` : Corrections de bugs
- `Sécurité` : Correctifs de sécurité
- `Améliorations` : Améliorations de performance ou qualité
