# 🔧 Guide de dépannage - ArmoireCheck

## ⚠️ Problème actuel détecté

**Erreur** : `ECONNREFUSED ::1:5432` - La base de données PostgreSQL n'est pas accessible.

---

## 🎯 Solutions rapides

### Option 1: Utiliser Docker (RECOMMANDÉ - La plus simple)

Docker démarre automatiquement PostgreSQL, le backend ET le frontend.

```bash
# Dans le dossier ArmoireCheck
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps

# Voir les logs
docker-compose logs -f
```

✅ **Avantages** :
- Tout est configuré automatiquement
- Base de données incluse
- Pas besoin d'installer PostgreSQL
- Fonctionne sur Windows, Mac, Linux

Puis ouvrir : http://localhost:3000

---

### Option 2: Utiliser Neon (Base de données cloud gratuite)

Si vous ne voulez pas installer PostgreSQL localement :

#### Étape 1 : Créer un compte Neon

1. Aller sur https://neon.tech
2. Créer un compte gratuit
3. Créer un nouveau projet
4. Copier la **connection string** (ressemble à `postgres://user:pass@host.neon.tech/db`)

#### Étape 2 : Configurer le backend

```bash
cd ArmoireCheck/backend

# Éditer le fichier .env
notepad .env
# OU
code .env
```

Modifier la ligne `DATABASE_URL` :
```env
DATABASE_URL=postgres://votre_user:votre_password@votre_host.neon.tech/votre_database?sslmode=require
```

#### Étape 3 : Initialiser la base de données

```bash
# Installer psql si pas déjà fait, ou utiliser l'interface web de Neon
# Via Neon web interface, exécuter les scripts :
# 1. Copier le contenu de backend/database/init.sql
# 2. Aller dans l'onglet SQL Editor de Neon
# 3. Coller et exécuter

# Puis les données de test
# 4. Copier le contenu de backend/database/seed.sql
# 5. Exécuter dans SQL Editor
```

#### Étape 4 : Démarrer le backend

```bash
cd backend
npm run dev
```

✅ Backend démarre sur http://localhost:5001

---

### Option 3: Installer PostgreSQL localement

#### Windows

1. **Télécharger PostgreSQL**
   - https://www.postgresql.org/download/windows/
   - Choisir la dernière version (15 ou 16)
   - Installer avec les paramètres par défaut
   - **Noter le mot de passe** que vous définissez pour l'utilisateur `postgres`

2. **Démarrer PostgreSQL**
   ```bash
   # PostgreSQL devrait démarrer automatiquement
   # Vérifier dans Services Windows (services.msc)
   # Chercher "PostgreSQL" et vérifier qu'il est "En cours d'exécution"
   ```

3. **Créer la base de données**
   ```bash
   # Ouvrir PowerShell ou CMD
   # Se connecter à PostgreSQL
   psql -U postgres

   # Dans psql, créer la base de données
   CREATE DATABASE armoirecheck;
   CREATE USER armoirecheck_user WITH PASSWORD 'votre_mot_de_passe';
   GRANT ALL PRIVILEGES ON DATABASE armoirecheck TO armoirecheck_user;
   \q
   ```

4. **Configurer le backend**
   ```bash
   cd ArmoireCheck\backend

   # Éditer .env
   notepad .env
   ```

   Modifier :
   ```env
   DATABASE_URL=postgres://armoirecheck_user:votre_mot_de_passe@localhost:5432/armoirecheck
   ```

5. **Initialiser la base de données**
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="postgres://armoirecheck_user:votre_mot_de_passe@localhost:5432/armoirecheck"

   # Exécuter les scripts
   psql $env:DATABASE_URL -f database/init.sql
   psql $env:DATABASE_URL -f database/seed.sql
   ```

6. **Démarrer le backend**
   ```bash
   npm run dev
   ```

---

## 🔍 Diagnostic des problèmes

### Vérifier si PostgreSQL est installé

```bash
# Windows
psql --version

# Si erreur "command not found", PostgreSQL n'est pas installé
```

### Vérifier si PostgreSQL est démarré

```bash
# Windows - Vérifier le service
sc query postgresql-x64-15
# OU
Get-Service -Name postgresql*

# Si "STOPPED", démarrer :
net start postgresql-x64-15
```

### Vérifier si le port 5432 est utilisé

```bash
# Windows
netstat -ano | findstr :5432

# Si rien n'apparaît, PostgreSQL n'écoute pas sur ce port
```

### Tester la connexion à la base de données

```bash
# Avec psql
psql -h localhost -U armoirecheck_user -d armoirecheck

# Si demande mot de passe et se connecte : ✅ OK
# Si erreur de connexion : ❌ Problème
```

---

## 🚨 Erreurs courantes et solutions

### Erreur : "ECONNREFUSED"
**Cause** : PostgreSQL n'est pas démarré ou pas installé

**Solution** :
1. Utiliser Docker (option 1)
2. OU utiliser Neon (option 2)
3. OU installer PostgreSQL (option 3)

---

### Erreur : "password authentication failed"
**Cause** : Mauvais mot de passe dans DATABASE_URL

**Solution** :
```bash
# Vérifier DATABASE_URL dans backend/.env
# Format correct :
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DATABASE
```

---

### Erreur : "database does not exist"
**Cause** : La base de données n'a pas été créée

**Solution** :
```bash
# Créer la base de données
psql -U postgres
CREATE DATABASE armoirecheck;
\q

# Puis exécuter les scripts
cd backend
npm run db:init
npm run db:seed
```

---

### Erreur : "relation does not exist"
**Cause** : Les tables n'ont pas été créées

**Solution** :
```bash
cd backend
npm run db:init
```

---

### Port 5001 déjà utilisé
**Cause** : Un autre processus utilise le port

**Solution** :
```bash
# Windows - Trouver le processus
netstat -ano | findstr :5001

# Noter le PID (dernière colonne)
# Arrêter le processus
taskkill /PID <PID> /F
```

---

### Frontend ne se connecte pas au backend
**Cause** : URL incorrecte dans frontend/.env

**Solution** :
```bash
# Éditer frontend/.env
REACT_APP_API_URL=http://localhost:5001/api

# Redémarrer le frontend
cd frontend
npm start
```

---

## ✅ Checklist de vérification

Cochez au fur et à mesure :

### Backend
- [ ] Node.js v16+ installé (`node --version`)
- [ ] Dépendances installées (`cd backend && npm install`)
- [ ] Fichier `.env` existe et configuré
- [ ] PostgreSQL accessible (Docker, Neon ou local)
- [ ] Base de données créée
- [ ] Tables créées (`npm run db:init`)
- [ ] Backend démarre sans erreur (`npm run dev`)
- [ ] API répond (`curl http://localhost:5001/api/status`)

### Frontend
- [ ] Dépendances installées (`cd frontend && npm install`)
- [ ] Fichier `.env` existe et configuré
- [ ] `REACT_APP_API_URL` pointe vers le backend
- [ ] Frontend démarre (`npm start`)
- [ ] Ouvre http://localhost:3000
- [ ] Pas d'erreurs dans la console (F12)

### Base de données
- [ ] PostgreSQL installé/accessible
- [ ] Base de données `armoirecheck` existe
- [ ] Tables créées (users, cabinets, tools, checks, missing_tools)
- [ ] Données de test insérées (optionnel)
- [ ] Connexion fonctionne

---

## 🎯 Solution recommandée pour vous

Basé sur l'erreur détectée, je recommande **Option 1 : Docker**.

### Pourquoi Docker ?

✅ **Avantages** :
- ✅ Tout fonctionne en une commande
- ✅ Pas besoin d'installer PostgreSQL
- ✅ Configuration automatique
- ✅ Isolation complète
- ✅ Même environnement partout

❌ **Inconvénients** :
- Nécessite Docker Desktop
- Utilise plus de ressources

### Installation rapide Docker

```bash
# 1. Installer Docker Desktop
# https://www.docker.com/products/docker-desktop

# 2. Démarrer Docker Desktop

# 3. Dans ArmoireCheck
docker-compose up -d

# 4. Attendre 30 secondes

# 5. Ouvrir http://localhost:3000
```

**C'est tout !** ✨

---

## 📞 Besoin d'aide supplémentaire ?

### Informations à fournir

Si vous avez toujours des problèmes, fournissez :

1. **Système d'exploitation** : Windows 10/11, Mac, Linux ?
2. **Version Node.js** : `node --version`
3. **PostgreSQL installé ?** : `psql --version`
4. **Erreur exacte** : Copier le message d'erreur complet
5. **Logs** :
   ```bash
   cd backend
   npm run dev > logs.txt 2>&1
   ```

### Logs utiles

```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
cd frontend
npm start

# Docker logs
docker-compose logs -f
```

---

## 🔗 Ressources

- [PostgreSQL Download](https://www.postgresql.org/download/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Neon Database](https://neon.tech)
- [Node.js Download](https://nodejs.org/)

---

**Dernière mise à jour** : 9 janvier 2026
