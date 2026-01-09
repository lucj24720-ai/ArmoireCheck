# 🚀 COMMENCER ICI - ArmoireCheck

Bienvenue dans **ArmoireCheck** ! Voici comment démarrer l'application en 3 minutes.

## ✨ Aperçu rapide

**ArmoireCheck** est une application web qui vous permet de:
- 📸 Scanner vos armoires à outils avec une webcam
- 🤖 Détecter automatiquement les outils manquants grâce à l'IA
- 📊 Suivre l'historique des vérifications
- 👥 Gérer plusieurs utilisateurs et armoires

## 🎯 Option 1: Démarrage avec Docker (RECOMMANDÉ)

### Prérequis
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé

### Étapes

```bash
# 1. Cloner le projet (si pas déjà fait)
cd ArmoireCheck

# 2. Créer le fichier .env (configuration minimale)
echo "JWT_SECRET=ma_cle_secrete_super_longue_et_aleatoire" > .env
echo "CLERK_PUBLISHABLE_KEY=pk_test_dummy" >> .env

# 3. Démarrer tous les services
docker-compose up -d

# 4. Attendre que tout démarre (30 secondes environ)
docker-compose logs -f

# 5. Accéder à l'application
```

🌐 **Ouvrir dans le navigateur:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Base de données: localhost:5432

### Comptes de test
- **Admin**: `admin` / `admin123`
- **User**: `user1` / `user123`

---

## 🎯 Option 2: Démarrage Manuel

### Prérequis
- [Node.js](https://nodejs.org/) v16+ installé
- [PostgreSQL](https://www.postgresql.org/) installé OU compte [Neon](https://neon.tech) (gratuit)

### Étape 1: Configuration Backend

```bash
# Aller dans le dossier backend
cd backend

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos valeurs:
# DATABASE_URL=postgres://user:password@localhost:5432/armoirecheck
# JWT_SECRET=une_tres_longue_cle_aleatoire_securisee
# PORT=5001

# Installer les dépendances
npm install

# Initialiser la base de données
npm run db:init

# Ajouter des données de test (optionnel)
npm run db:seed

# Démarrer le serveur
npm run dev
```

✅ Le backend démarre sur **http://localhost:5001**

### Étape 2: Configuration Frontend

```bash
# Ouvrir un NOUVEAU terminal
# Aller dans le dossier frontend
cd frontend

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec:
# REACT_APP_API_URL=http://localhost:5001/api
# REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_votre_cle_clerk

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

✅ Le frontend s'ouvre automatiquement sur **http://localhost:3000**

---

## 🎮 Première utilisation

### 1. Se connecter
```
👤 Username: admin
🔐 Password: admin123
```

### 2. Voir les armoires
- Cliquez sur **"Cabinets"** dans le menu
- 3 armoires de démonstration apparaissent
- Cliquez sur une armoire pour voir les détails

### 3. Effectuer une vérification
- Dans les détails d'une armoire, cliquez **"Effectuer une vérification"**
- Autorisez l'accès à votre webcam
- Prenez une photo de votre environnement (ou n'importe quoi pour tester)
- Cliquez **"Confirm"**
- L'IA analyse l'image et détecte les différences

### 4. Mode Admin
- Cliquez sur **"Admin"** dans le menu
- Ajoutez/modifiez des armoires
- Gérez les outils
- Voyez les statistiques

---

## 📊 Vérifier que tout fonctionne

### Backend
```bash
# Test de l'API
curl http://localhost:5001/api/status

# Devrait retourner:
{"status":"OK","message":"Backend is running"}
```

### Frontend
- Ouvrez http://localhost:3000
- Vous devriez voir la page d'accueil ArmoireCheck
- Aucune erreur dans la console du navigateur (F12)

### Base de données
```bash
# Se connecter à PostgreSQL
psql $DATABASE_URL

# Vérifier les tables
\dt

# Devrait afficher: users, cabinets, tools, checks, missing_tools
```

---

## 🐛 Problèmes courants

### Port déjà utilisé

```bash
# Trouver et arrêter le processus
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5001
kill -9 <PID>
```

### Base de données ne se connecte pas

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez `DATABASE_URL` dans `.env`
3. Testez la connexion:
   ```bash
   psql $DATABASE_URL
   ```

### Webcam ne fonctionne pas

1. Vérifiez les permissions du navigateur
2. Utilisez HTTPS ou localhost (requis pour webcam)
3. Essayez un autre navigateur (Chrome recommandé)

### Docker ne démarre pas

```bash
# Voir les logs
docker-compose logs

# Redémarrer proprement
docker-compose down
docker-compose up -d --build
```

---

## 📚 Prochaines étapes

### Apprendre
1. 📖 Lire [README.md](README.md) - Documentation complète
2. 🎨 Voir [APP_OVERVIEW.md](APP_OVERVIEW.md) - Aperçu visuel
3. 🏗️ Consulter [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique

### Développer
1. 🔧 Lire [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
2. 🧪 Lancer les tests: `npm test`
3. 🎨 Personnaliser le thème dans `frontend/src/App.js`

### Déployer
1. 🐳 Lire [DOCKER.md](DOCKER.md) - Guide Docker
2. 🚀 Suivre le guide de déploiement dans [README.md](README.md)
3. ☁️ Déployer sur Vercel (frontend) et Railway (backend)

---

## 🎯 Structure des dossiers

```
ArmoireCheck/
│
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── index.js     # Point d'entrée
│   │   └── middleware/  # Middlewares
│   ├── database/        # Scripts SQL
│   ├── .env            # Config (créer depuis .env.example)
│   └── package.json
│
├── frontend/            # Application React
│   ├── src/
│   │   ├── App.js      # Composant principal
│   │   ├── pages/      # Pages de l'app
│   │   ├── components/ # Composants réutilisables
│   │   ├── services/   # Services (API, IA)
│   │   └── contexts/   # Contextes React
│   ├── .env           # Config (créer depuis .env.example)
│   └── package.json
│
├── docker-compose.yml  # Orchestration Docker
├── README.md          # Documentation principale
└── START_HERE.md      # Ce fichier
```

---

## 💡 Astuces

### Commandes utiles

```bash
# Backend
cd backend
npm run dev        # Démarrer en mode développement
npm test          # Lancer les tests
npm run lint      # Vérifier le code
npm run db:reset  # Réinitialiser la BDD

# Frontend
cd frontend
npm start         # Démarrer
npm run build     # Build production
npm test          # Tests

# Docker
docker-compose up -d           # Démarrer
docker-compose logs -f         # Voir les logs
docker-compose down            # Arrêter
docker-compose restart backend # Redémarrer un service
```

### Raccourcis clavier (dans l'app)

- `Ctrl + K` - Recherche rapide (à implémenter)
- `Ctrl + N` - Nouvelle vérification (à implémenter)
- `Ctrl + /` - Aide (à implémenter)

---

## 🆘 Besoin d'aide ?

### Documentation
- 📖 [README.md](README.md) - Guide complet
- ❓ [FAQ](README.md#troubleshooting) - Questions fréquentes
- 🐛 [Issues GitHub](https://github.com/lucj24720-ai/ArmoireCheck/issues)

### Support
1. Vérifiez la [checklist](CHECKLIST.md)
2. Consultez les [problèmes courants](#-problèmes-courants) ci-dessus
3. Ouvrez une issue sur GitHub avec:
   - Description du problème
   - Étapes pour reproduire
   - Logs d'erreur
   - Environnement (OS, Node version, etc.)

---

## 🎉 Félicitations !

Vous avez maintenant ArmoireCheck qui tourne !

**Prochaines actions:**
1. ✅ Tester avec votre vraie armoire à outils
2. ✅ Ajouter vos propres armoires
3. ✅ Inviter votre équipe
4. ✅ Personnaliser selon vos besoins

**Bon scan !** 🛠️📸

---

*Dernière mise à jour: 9 janvier 2026 - Version 1.2.0*
