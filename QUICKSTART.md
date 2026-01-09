# Guide de démarrage rapide - ArmoireCheck

Ce guide vous permet de lancer l'application en quelques minutes.

## Prérequis

- [Node.js](https://nodejs.org/) v16 ou supérieur
- [PostgreSQL](https://www.postgresql.org/) ou un compte [Neon](https://neon.tech) (gratuit)
- Un compte [Clerk](https://clerk.com) (gratuit)

## Installation en 5 étapes

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/lucj24720-ai/ArmoireCheck.git
cd ArmoireCheck
```

### Étape 2 : Configurer la base de données

#### Option A : Utiliser Neon (Recommandé - Gratuit)

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Copier la chaîne de connexion (ressemble à `postgres://user:pass@host.neon.tech/db`)

#### Option B : PostgreSQL local

```bash
# Créer une base de données locale
createdb armoirecheck
```

#### Initialiser le schéma

```bash
cd backend

# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env et ajouter votre DATABASE_URL

# Initialiser la base de données
psql $DATABASE_URL -f database/init.sql

# Ajouter des données de test (optionnel)
psql $DATABASE_URL -f database/seed.sql
```

### Étape 3 : Configurer l'authentification Clerk

1. Créer un compte sur [clerk.com](https://clerk.com)
2. Créer une nouvelle application
3. Copier la clé publique (commence par `pk_test_...`)

### Étape 4 : Configuration Backend

```bash
cd backend

# Si pas déjà fait
cp .env.example .env

# Éditer .env avec vos valeurs :
# DATABASE_URL=votre_url_neon
# JWT_SECRET=une_cle_secrete_aleatoire_tres_longue
# PORT=5001

# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev
```

Le backend démarre sur `http://localhost:5001`

### Étape 5 : Configuration Frontend

```bash
cd frontend

# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos valeurs :
# REACT_APP_API_URL=http://localhost:5001/api
# REACT_APP_CLERK_PUBLISHABLE_KEY=votre_cle_clerk

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

L'application démarre sur `http://localhost:3000`

## Utilisation

### Comptes de test (si vous avez exécuté seed.sql)

**Administrateur :**
- Username: `admin`
- Password: `admin123`

**Utilisateur :**
- Username: `user1`
- Password: `user123`

### Premier test

1. Ouvrir `http://localhost:3000`
2. Se connecter avec le compte admin
3. Aller dans "Admin" pour créer une armoire
4. Ajouter des outils à l'armoire
5. Tester la vérification en prenant une photo

## Commandes utiles

### Backend

```bash
cd backend
npm run dev      # Démarrer en mode développement
npm start        # Démarrer en mode production
```

### Frontend

```bash
cd frontend
npm start        # Démarrer en mode développement
npm run build    # Build pour production
npm test         # Lancer les tests
```

## Dépannage rapide

### "Cannot connect to database"

Vérifier que :
- `DATABASE_URL` est correcte dans `backend/.env`
- La base de données est accessible
- Les scripts d'initialisation ont été exécutés

### "CORS error" dans le navigateur

Vérifier que :
- Le backend est bien démarré sur le port 5001
- `REACT_APP_API_URL` dans `frontend/.env` pointe vers le bon port

### "Clerk error"

Vérifier que :
- `REACT_APP_CLERK_PUBLISHABLE_KEY` est correcte
- La clé commence par `pk_test_` ou `pk_live_`

### Images ne chargent pas

Vérifier :
- La connexion internet (images viennent d'Unsplash)
- Les URLs dans la base de données sont valides

## Prochaines étapes

1. **Personnaliser les armoires** : Ajouter vos propres armoires et outils
2. **Tester la reconnaissance** : Prendre des photos et tester la détection
3. **Configurer le déploiement** : Voir [README.md](README.md#déploiement) pour déployer en production
4. **Améliorer le modèle** : Entraîner un modèle personnalisé pour vos outils

## Ressources

- [Documentation complète](README.md)
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](README.md#api-documentation)

## Support

- Ouvrir une issue sur [GitHub](https://github.com/lucj24720-ai/ArmoireCheck/issues)
- Consulter la documentation complète

---

Bon développement ! 🚀
