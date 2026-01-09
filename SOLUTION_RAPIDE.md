# 🚀 SOLUTION RAPIDE - ArmoireCheck

## ⚠️ Problème détecté : PostgreSQL non connecté

Le backend démarre mais ne peut pas se connecter à la base de données.

---

## ✅ Solution 1 : Docker (LA PLUS SIMPLE - 2 minutes)

### Étape 1 : Installer Docker Desktop
- Télécharger : https://www.docker.com/products/docker-desktop
- Installer et démarrer Docker Desktop

### Étape 2 : Démarrer tout
```bash
# Dans le dossier ArmoireCheck
docker-compose up -d
```

### Étape 3 : Attendre 30 secondes puis ouvrir
- http://localhost:3000

**C'EST TOUT !** Tout fonctionne (PostgreSQL, Backend, Frontend)

---

## ✅ Solution 2 : Neon Database (Cloud gratuit - 5 minutes)

### Étape 1 : Créer un compte Neon
1. Aller sur https://neon.tech
2. Créer un compte (gratuit)
3. Créer un nouveau projet
4. Copier la "Connection String" qui ressemble à :
   ```
   postgres://user:pass@ep-something.neon.tech/db?sslmode=require
   ```

### Étape 2 : Configurer le backend
```bash
cd backend

# Ouvrir le fichier .env dans un éditeur
notepad .env

# Remplacer la ligne DATABASE_URL par votre connection string Neon :
DATABASE_URL=postgres://votre_user:votre_pass@ep-xxx.neon.tech/votre_db?sslmode=require
```

### Étape 3 : Initialiser la base de données

#### Option A : Via l'interface web Neon (Plus simple)
1. Aller dans Neon → Votre projet → SQL Editor
2. Copier le contenu de `backend/database/init.sql`
3. Coller dans SQL Editor et cliquer "Run"
4. Copier le contenu de `backend/database/seed.sql`
5. Coller et cliquer "Run"

#### Option B : Via psql (Si installé)
```bash
# Définir la variable d'environnement
set DATABASE_URL=postgres://votre_connection_string

# Exécuter les scripts
cd backend
psql %DATABASE_URL% -f database/init.sql
psql %DATABASE_URL% -f database/seed.sql
```

### Étape 4 : Démarrer l'application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Étape 5 : Ouvrir
- http://localhost:3000
- Login : `admin` / `admin123`

---

## ✅ Solution 3 : PostgreSQL Local (15 minutes)

### Étape 1 : Installer PostgreSQL
1. Télécharger : https://www.postgresql.org/download/windows/
2. Installer (garder les paramètres par défaut)
3. **Noter le mot de passe** que vous définissez pour `postgres`

### Étape 2 : Démarrer PostgreSQL
```bash
# Vérifier que le service PostgreSQL est démarré
# Windows : Ouvrir "Services" (services.msc)
# Chercher "postgresql" et vérifier qu'il est "En cours d'exécution"
```

### Étape 3 : Créer la base de données
```bash
# Ouvrir PowerShell ou CMD
# Se connecter à PostgreSQL
psql -U postgres

# Dans psql, taper :
CREATE DATABASE armoirecheck;
CREATE USER armoirecheck_user WITH PASSWORD 'monmotdepasse';
GRANT ALL PRIVILEGES ON DATABASE armoirecheck TO armoirecheck_user;
\q
```

### Étape 4 : Configurer le backend
```bash
cd backend

# Ouvrir .env
notepad .env

# Modifier la ligne DATABASE_URL :
DATABASE_URL=postgres://armoirecheck_user:monmotdepasse@localhost:5432/armoirecheck
```

### Étape 5 : Initialiser la base de données
```bash
# PowerShell
$env:DATABASE_URL="postgres://armoirecheck_user:monmotdepasse@localhost:5432/armoirecheck"

cd backend
psql $env:DATABASE_URL -f database/init.sql
psql $env:DATABASE_URL -f database/seed.sql
```

### Étape 6 : Démarrer
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm start
```

---

## 🔍 Vérifier que ça marche

### Backend
```bash
# Ouvrir http://localhost:5001/api/status dans le navigateur
# Ou dans PowerShell/CMD :
curl http://localhost:5001/api/status

# Devrait retourner : {"status":"OK","message":"Backend is running"}
```

### Frontend
- Ouvrir http://localhost:3000
- Vous devriez voir la page d'accueil ArmoireCheck
- Pas d'erreurs dans la console (F12)

### Connexion
- Username : `admin`
- Password : `admin123`

---

## ❌ Toujours un problème ?

### Erreur "ECONNREFUSED" persiste
→ PostgreSQL n'est pas démarré
→ Solution : Utiliser **Docker** ou **Neon** (plus simple)

### Erreur "password authentication failed"
→ Mauvais mot de passe dans DATABASE_URL
→ Vérifier backend/.env

### Port 5001 déjà utilisé
```bash
# Windows
netstat -ano | findstr :5001
# Noter le PID (dernière colonne)
taskkill /PID <PID> /F
```

### Webcam ne marche pas
→ Normal, fonctionne uniquement sur localhost ou HTTPS
→ Chrome recommandé

---

## 📚 Documentations

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Guide complet de dépannage
- [START_HERE.md](START_HERE.md) - Guide de démarrage
- [README.md](README.md) - Documentation complète

---

## 💡 Quelle solution choisir ?

| Solution | Difficulté | Temps | Recommandé pour |
|----------|------------|-------|-----------------|
| **Docker** | ⭐ Facile | 2 min | Tout le monde |
| **Neon** | ⭐⭐ Moyen | 5 min | Production, démo |
| **PostgreSQL local** | ⭐⭐⭐ Difficile | 15 min | Développement offline |

**Ma recommandation : Docker** si vous pouvez l'installer, sinon **Neon**.

---

**Dernière mise à jour** : 9 janvier 2026

Besoin d'aide ? Voir TROUBLESHOOTING.md
