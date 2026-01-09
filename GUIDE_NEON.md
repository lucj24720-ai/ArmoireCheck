# 🚀 Guide Complet - Configuration Neon pour ArmoireCheck

## Pourquoi Neon ?
- ✅ **Gratuit** - Pas besoin de carte bancaire
- ✅ **Aucune installation** - Tout dans le cloud
- ✅ **Prêt en 5 minutes** - Plus rapide que Docker ou PostgreSQL local
- ✅ **Fiable** - Base de données PostgreSQL professionnelle

---

## Étape 1: Créer un compte Neon (2 minutes)

### 1.1 - Aller sur Neon
Ouvrez votre navigateur et allez sur: **https://neon.tech**

### 1.2 - S'inscrire
Cliquez sur le bouton **"Sign Up"** en haut à droite

Vous avez 3 options:
- **GitHub** (recommandé si vous avez un compte)
- **Google**
- **Email** (créer un nouveau compte)

Choisissez celle qui vous convient et suivez les instructions.

### 1.3 - Vérifier votre email
Si vous utilisez l'option Email, vérifiez votre boîte mail et cliquez sur le lien de confirmation.

---

## Étape 2: Créer un projet (1 minute)

### 2.1 - Tableau de bord
Une fois connecté, vous arrivez sur le tableau de bord Neon.

Cliquez sur le bouton **"Create a project"** (ou "New Project").

### 2.2 - Configuration du projet
Remplissez les informations:
- **Project name**: `ArmoireCheck` (ou le nom de votre choix)
- **Database name**: Laissez `neondb` (par défaut)
- **Region**: Choisissez la région la plus proche (ex: `EU West (Frankfurt)` si vous êtes en Europe)

Cliquez sur **"Create project"**

### 2.3 - Attendre la création
Neon va créer votre base de données. Cela prend environ 10-20 secondes.

---

## Étape 3: Copier la Connection String (30 secondes)

### 3.1 - Trouver la Connection String
Une fois le projet créé, vous voyez un écran avec plusieurs informations.

Cherchez la section **"Connection Details"** ou **"Connection String"**.

### 3.2 - Copier l'URL complète
Vous devriez voir une longue URL qui ressemble à:
```
postgres://username:password@ep-something-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**IMPORTANT**: Cliquez sur l'icône **"Copy"** à côté de cette URL pour la copier dans votre presse-papier.

**Ne fermez pas cette page** - vous en aurez besoin à l'étape suivante.

---

## Étape 4: Configurer ArmoireCheck (1 minute)

### 4.1 - Ouvrir le fichier .env
Allez dans le dossier `ArmoireCheck/backend/` et ouvrez le fichier `.env` avec un éditeur de texte:
- **Notepad** (Windows)
- **VS Code**
- **Notepad++**
- Ou n'importe quel éditeur

### 4.2 - Remplacer la DATABASE_URL
Trouvez la ligne 3 qui contient:
```
DATABASE_URL=postgres://user:password@localhost:5432/armoirecheck
```

Remplacez-la par votre connection string Neon (celle que vous avez copiée):
```
DATABASE_URL=postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Exemple complet du fichier .env**:
```env
# REMPLACER cette ligne par votre connection string Neon:
# DATABASE_URL=postgres://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
DATABASE_URL=postgres://alex:kj3h4k5j6h7k8@ep-cool-mountain-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Clé secrète pour JWT (générée automatiquement)
JWT_SECRET=ArmoireCheck_Super_Secret_Key_2026_JHG8d9fhs8FHS9fh923hfkJHF8s9dfh
PORT=5001
```

### 4.3 - Sauvegarder
Sauvegardez le fichier (Ctrl+S).

---

## Étape 5: Initialiser la Base de Données (1-2 minutes)

### Option A: Via l'interface web Neon (RECOMMANDÉ - Plus simple)

#### 5.A.1 - Ouvrir SQL Editor
Retournez sur le site Neon, dans votre projet ArmoireCheck.

Dans le menu de gauche, cliquez sur **"SQL Editor"**.

#### 5.A.2 - Copier init.sql
Ouvrez le fichier `ArmoireCheck/backend/database/init.sql` avec un éditeur de texte.

Sélectionnez TOUT le contenu (Ctrl+A) et copiez (Ctrl+C).

#### 5.A.3 - Exécuter init.sql
Retournez dans le SQL Editor de Neon.

Collez le contenu (Ctrl+V) dans l'éditeur.

Cliquez sur le bouton **"Run"** (ou appuyez sur Ctrl+Enter).

Vous devriez voir un message de succès avec "5 tables created".

#### 5.A.4 - Copier seed.sql
Ouvrez le fichier `ArmoireCheck/backend/database/seed.sql`.

Sélectionnez TOUT le contenu (Ctrl+A) et copiez (Ctrl+C).

#### 5.A.5 - Exécuter seed.sql
Dans le SQL Editor de Neon, **effacez** le contenu précédent.

Collez le contenu de seed.sql (Ctrl+V).

Cliquez sur **"Run"**.

Vous devriez voir un message indiquant que des utilisateurs, armoires, et outils ont été créés.

**C'EST TOUT !** Votre base de données est prête.

---

### Option B: Via la ligne de commande (Si vous avez psql installé)

Si vous préférez utiliser la ligne de commande (et que `psql` est installé):

```bash
# Windows PowerShell
$env:DATABASE_URL="votre_connection_string_neon_ici"
cd backend
psql $env:DATABASE_URL -f database/init.sql
psql $env:DATABASE_URL -f database/seed.sql
```

```bash
# Linux/Mac
export DATABASE_URL="votre_connection_string_neon_ici"
cd backend
psql $DATABASE_URL -f database/init.sql
psql $DATABASE_URL -f database/seed.sql
```

---

## Étape 6: Démarrer l'Application (1 minute)

### 6.1 - Démarrer le Backend
Ouvrez un terminal (PowerShell, CMD, ou Git Bash).

```bash
cd ArmoireCheck/backend
npm run dev
```

Vous devriez voir:
```
Server running on port 5001
Database connected successfully
```

**Si vous voyez "Database connected successfully" = SUCCÈS ! 🎉**

### 6.2 - Démarrer le Frontend
Ouvrez un NOUVEAU terminal (laissez le backend tourner).

```bash
cd ArmoireCheck/frontend
npm start
```

Le navigateur devrait s'ouvrir automatiquement sur **http://localhost:3000**

---

## Étape 7: Tester l'Application

### 7.1 - Connexion
Sur la page d'accueil, vous devriez voir un formulaire de connexion.

Utilisez les identifiants de test:
- **Username**: `admin`
- **Password**: `admin123`

Cliquez sur **Login**.

### 7.2 - Explorer
Une fois connecté, vous devriez voir:
- Le tableau de bord (Dashboard)
- La liste des armoires (3 armoires de démonstration)
- Le menu Admin (si connecté en tant qu'admin)

**Félicitations ! L'application fonctionne !** 🎊

---

## 🔍 Vérification

### Vérifier que le backend fonctionne
Dans un navigateur, allez sur: **http://localhost:5001/api/status**

Vous devriez voir:
```json
{
  "status": "OK",
  "message": "Backend is running"
}
```

### Vérifier la base de données
Dans le SQL Editor de Neon, exécutez:
```sql
SELECT * FROM users;
```

Vous devriez voir 3 utilisateurs: admin, user1, user2.

---

## ❌ Problèmes Courants

### "Connection timeout" ou "ECONNREFUSED"
- Vérifiez que vous avez bien copié TOUTE la connection string (elle est très longue)
- Vérifiez qu'il n'y a pas d'espaces avant ou après l'URL
- Assurez-vous que l'URL se termine par `?sslmode=require`

### "password authentication failed"
- La connection string contient déjà le mot de passe
- Ne modifiez rien dans l'URL, utilisez-la telle quelle

### "relation does not exist"
- Vous n'avez pas exécuté init.sql
- Retournez à l'Étape 5 et exécutez les scripts SQL

### "Port 5001 already in use"
Un autre processus utilise le port. Pour le libérer:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5001
kill -9 <PID>
```

---

## 📚 Prochaines Étapes

Maintenant que tout fonctionne:
1. ✅ Explorez l'application
2. ✅ Ajoutez vos propres armoires
3. ✅ Testez la capture d'image avec votre webcam
4. ✅ Créez de nouveaux utilisateurs
5. ✅ Lisez la documentation complète dans README.md

---

## 💡 Astuces Neon

### Tableau de bord Neon
- **Tables**: Voir les données directement dans l'interface
- **Metrics**: Suivre l'utilisation de votre base de données
- **Backups**: Neon sauvegarde automatiquement vos données
- **Branches**: Créer des environnements de test (fonctionnalité avancée)

### Limites du plan gratuit
- **500 MB** de stockage (largement suffisant pour ArmoireCheck)
- **1 projet** actif
- **Inactivité**: Mise en veille après 5 minutes d'inactivité (réveil automatique en <1 seconde)

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez un problème:
1. Vérifiez la section "Problèmes Courants" ci-dessus
2. Consultez [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Vérifiez les logs du backend dans le terminal
4. Ouvrez la console du navigateur (F12) pour voir les erreurs frontend

---

**Dernière mise à jour**: 9 janvier 2026
**Version**: 1.0

🎉 **Bon développement avec ArmoireCheck !**
