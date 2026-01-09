# Guide Docker - ArmoireCheck

Ce guide explique comment déployer ArmoireCheck avec Docker et Docker Compose.

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/install/) installé

## Démarrage rapide avec Docker Compose

### 1. Configuration

Créer un fichier `.env` à la racine du projet :

```bash
# Clé JWT (générer une clé aléatoire sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_aleatoire

# Clé publique Clerk
CLERK_PUBLISHABLE_KEY=pk_test_votre_cle_clerk
```

### 2. Démarrer tous les services

```bash
# Démarrer en mode détaché
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3. Accéder à l'application

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5001
- **PostgreSQL** : localhost:5432

### 4. Arrêter les services

```bash
# Arrêter les services
docker-compose stop

# Arrêter et supprimer les conteneurs
docker-compose down

# Arrêter et supprimer les conteneurs + volumes
docker-compose down -v
```

## Services disponibles

### PostgreSQL

- **Image** : postgres:15-alpine
- **Port** : 5432
- **Base de données** : armoirecheck
- **Utilisateur** : armoirecheck_user
- **Mot de passe** : armoirecheck_password (modifiable dans docker-compose.yml)
- **Initialisation** : Les scripts SQL sont exécutés automatiquement au premier démarrage

### Backend

- **Port** : 5001
- **Hot reload** : Activé en développement
- **Healthcheck** : Endpoint `/api/status`

### Frontend

- **Port** : 3000
- **Hot reload** : Activé en développement
- **Build** : Production optimisée avec Nginx

## Commandes utiles

### Gestion des conteneurs

```bash
# Lister les conteneurs en cours d'exécution
docker-compose ps

# Redémarrer un service
docker-compose restart backend

# Reconstruire les images
docker-compose build

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Accès aux conteneurs

```bash
# Shell dans le conteneur backend
docker-compose exec backend sh

# Shell dans le conteneur frontend
docker-compose exec frontend sh

# Shell dans PostgreSQL
docker-compose exec postgres psql -U armoirecheck_user -d armoirecheck
```

### Gestion de la base de données

```bash
# Exécuter le script d'initialisation manuellement
docker-compose exec postgres psql -U armoirecheck_user -d armoirecheck -f /docker-entrypoint-initdb.d/01-init.sql

# Exécuter le script de seed
docker-compose exec postgres psql -U armoirecheck_user -d armoirecheck -f /docker-entrypoint-initdb.d/02-seed.sql

# Backup de la base de données
docker-compose exec postgres pg_dump -U armoirecheck_user armoirecheck > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U armoirecheck_user armoirecheck < backup.sql
```

### Logs et débogage

```bash
# Voir tous les logs
docker-compose logs

# Suivre les logs en temps réel
docker-compose logs -f

# Logs des 100 dernières lignes
docker-compose logs --tail=100

# Inspecter un conteneur
docker inspect armoirecheck-backend
```

## Déploiement en production

### Build des images

```bash
# Backend
cd backend
docker build -t armoirecheck-backend:latest .

# Frontend
cd frontend
docker build \
  --build-arg REACT_APP_API_URL=https://api.votre-domaine.com/api \
  --build-arg REACT_APP_CLERK_PUBLISHABLE_KEY=votre_cle_clerk \
  -t armoirecheck-frontend:latest .
```

### Utiliser une base de données externe

Modifier `docker-compose.yml` pour pointer vers votre base de données en production :

```yaml
backend:
  environment:
    DATABASE_URL: postgres://user:password@your-db-host:5432/armoirecheck
```

### Variables d'environnement en production

Créer un fichier `.env.production` :

```env
# Base de données
DATABASE_URL=postgres://user:password@production-db:5432/armoirecheck

# JWT Secret (IMPORTANT: utiliser une vraie clé aléatoire)
JWT_SECRET=une_tres_longue_cle_aleatoire_securisee

# Clerk
CLERK_PUBLISHABLE_KEY=pk_live_votre_cle_production

# Node environment
NODE_ENV=production
```

### Utiliser Docker Swarm ou Kubernetes

#### Docker Swarm

```bash
# Initialiser Swarm
docker swarm init

# Déployer le stack
docker stack deploy -c docker-compose.yml armoirecheck

# Voir les services
docker service ls

# Voir les logs
docker service logs armoirecheck_backend
```

#### Kubernetes

Voir les fichiers de configuration Kubernetes (à créer) dans le dossier `k8s/`.

## Optimisations

### Cache des layers Docker

Les Dockerfiles utilisent le cache de manière optimale :
- Les dépendances npm sont installées avant de copier le code
- Les builds multi-stage réduisent la taille des images finales

### Volumes

Les volumes persistants permettent de :
- Garder les données PostgreSQL entre les redémarrages
- Hot reload en développement

### Health checks

Les services ont des health checks configurés :
- Backend : Vérifie l'endpoint `/api/status`
- PostgreSQL : Vérifie la disponibilité avec `pg_isready`

## Troubleshooting

### Port déjà utilisé

```bash
# Vérifier quel processus utilise le port
lsof -i :5001
lsof -i :3000

# Ou sur Windows
netstat -ano | findstr :5001
```

### Problèmes de connexion à la base de données

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs PostgreSQL
docker-compose logs postgres

# Tester la connexion
docker-compose exec postgres psql -U armoirecheck_user -d armoirecheck -c "SELECT 1"
```

### Backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier les variables d'environnement
docker-compose exec backend env

# Redémarrer le service
docker-compose restart backend
```

### Frontend ne compile pas

```bash
# Vérifier les logs
docker-compose logs frontend

# Nettoyer et reconstruire
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### Réinitialiser complètement

```bash
# Arrêter et supprimer tout
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Supprimer les conteneurs orphelins
docker system prune -a

# Redémarrer
docker-compose up -d --build
```

## Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Best practices Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
