# ⚡ DEMARRAGE ULTRA-RAPIDE - 5 MINUTES

## 📋 Checklist Rapide

- [ ] Compte Neon créé
- [ ] Connection string copiée
- [ ] Fichier `.env` modifié
- [ ] Scripts SQL exécutés
- [ ] Application démarrée

---

## 🚀 Les 5 Étapes

### 1️⃣ Créer un compte Neon (2 min)

```
1. Aller sur https://neon.tech
2. Cliquer "Sign Up" (GitHub/Google/Email)
3. Cliquer "Create a project"
4. Nom: ArmoireCheck
5. Région: La plus proche
6. Cliquer "Create project"
```

### 2️⃣ Copier la Connection String (30 sec)

Sur Neon, chercher "Connection String" et copier l'URL complète:
```
postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 3️⃣ Configurer ArmoireCheck (30 sec)

Ouvrir `ArmoireCheck/backend/.env` et remplacer la ligne 3:

**AVANT:**
```env
DATABASE_URL=postgres://user:password@localhost:5432/armoirecheck
```

**APRÈS (avec VOTRE connection string):**
```env
DATABASE_URL=postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

Sauvegarder (Ctrl+S).

### 4️⃣ Initialiser la Base de Données (1 min)

**Dans Neon:**
1. Aller dans "SQL Editor" (menu gauche)
2. Ouvrir `ArmoireCheck/backend/database/init.sql`
3. Copier TOUT le contenu (Ctrl+A, Ctrl+C)
4. Coller dans SQL Editor (Ctrl+V)
5. Cliquer "Run"
6. **Répéter** avec `backend/database/seed.sql`

### 5️⃣ Démarrer l'Application (1 min)

**Terminal 1 - Backend:**
```bash
cd ArmoireCheck/backend
npm run dev
```

Attendre le message: `Database connected successfully`

**Terminal 2 - Frontend:**
```bash
cd ArmoireCheck/frontend
npm start
```

Le navigateur s'ouvre automatiquement.

---

## ✅ Test de Connexion

**Avant de démarrer**, testez la connexion:

```bash
cd ArmoireCheck
node test-connection.js
```

Si tout est OK, vous voyez:
```
RESULTAT: Tous les tests ont reussi!
Votre base de donnees est prete!
```

Si erreur, consultez [GUIDE_NEON.md](GUIDE_NEON.md)

---

## 🎮 Premier Login

```
URL: http://localhost:3000
Username: admin
Password: admin123
```

---

## ❌ Problème ?

### Erreur "ENOTFOUND" ou "connection timeout"
→ Vérifiez que vous avez copié TOUTE la connection string (elle est très longue)

### Erreur "relation does not exist"
→ Vous n'avez pas exécuté les scripts SQL (Étape 4)

### Port 5001 déjà utilisé
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

---

## 📚 Documentation Complète

- [GUIDE_NEON.md](GUIDE_NEON.md) - Guide détaillé avec captures d'écran
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Solutions aux problèmes
- [START_HERE.md](START_HERE.md) - Guide de démarrage complet

---

**C'est tout !** 🎉

En 5 minutes, vous avez:
- ✅ Une base de données cloud gratuite
- ✅ Un backend Node.js fonctionnel
- ✅ Un frontend React opérationnel
- ✅ Des données de test

**Bon scan !** 📸🛠️
