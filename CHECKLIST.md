# Checklist de vérification - ArmoireCheck

Utilisez cette checklist pour vérifier que votre installation est complète et fonctionnelle.

## ✅ Installation initiale

### Fichiers de configuration

- [ ] Le fichier `backend/.env` existe et est configuré
- [ ] Le fichier `frontend/.env` existe et est configuré
- [ ] Les variables `DATABASE_URL`, `JWT_SECRET` sont définies
- [ ] La clé `REACT_APP_CLERK_PUBLISHABLE_KEY` est définie

### Dépendances

- [ ] Node.js v16+ est installé (`node --version`)
- [ ] npm v8+ est installé (`npm --version`)
- [ ] Les dépendances backend sont installées (`cd backend && npm list`)
- [ ] Les dépendances frontend sont installées (`cd frontend && npm list`)

### Base de données

- [ ] PostgreSQL est accessible (local ou Neon)
- [ ] Le script `init.sql` a été exécuté
- [ ] Le script `seed.sql` a été exécuté (optionnel)
- [ ] Les 5 tables existent (users, cabinets, tools, checks, missing_tools)

## 🚀 Tests de démarrage

### Backend

- [ ] Le backend démarre sans erreur (`npm run dev`)
- [ ] Le serveur écoute sur le port 5001
- [ ] L'endpoint `/api/status` retourne `{"status":"OK"}`
- [ ] Les logs sont créés dans `backend/logs/`

### Frontend

- [ ] Le frontend démarre sans erreur (`npm start`)
- [ ] L'application s'ouvre sur `http://localhost:3000`
- [ ] Aucune erreur dans la console du navigateur
- [ ] La page d'accueil s'affiche correctement

### Connexion

- [ ] La page de login est accessible
- [ ] Connexion avec admin/admin123 fonctionne
- [ ] Le token JWT est stocké dans localStorage
- [ ] La déconnexion fonctionne

## 🔧 Tests fonctionnels

### Armoires

- [ ] La liste des armoires s'affiche
- [ ] On peut voir les détails d'une armoire
- [ ] Les outils d'une armoire sont visibles
- [ ] Les images des armoires se chargent

### Admin (avec compte admin)

- [ ] Accès au panel admin
- [ ] Création d'une nouvelle armoire
- [ ] Ajout d'un outil à une armoire
- [ ] Modification d'une armoire
- [ ] Suppression d'un outil

### Vérification

- [ ] La page de vérification est accessible
- [ ] La webcam peut être activée (si disponible)
- [ ] Une image peut être capturée
- [ ] La vérification se lance sans erreur

## 🐳 Tests Docker (optionnel)

### Docker Compose

- [ ] Docker et Docker Compose sont installés
- [ ] `docker-compose up` démarre tous les services
- [ ] Les 3 conteneurs sont en cours d'exécution
- [ ] PostgreSQL est accessible depuis le backend
- [ ] Frontend accessible sur `http://localhost:3000`
- [ ] Backend accessible sur `http://localhost:5001`

### Images Docker

- [ ] L'image backend se build sans erreur
- [ ] L'image frontend se build sans erreur
- [ ] Les healthchecks sont au vert

## 📝 Documentation

- [ ] Le README.md est à jour
- [ ] Le QUICKSTART.md est lu
- [ ] L'ARCHITECTURE.md est consultée
- [ ] Les fichiers .env.example existent

## 🔒 Sécurité

- [ ] Le fichier `.env` n'est PAS dans git
- [ ] Le fichier `.gitignore` est configuré
- [ ] Les mots de passe sont hashés dans la BDD
- [ ] Les tokens JWT expirent après 24h
- [ ] CORS est configuré correctement

## 🎯 API Tests

### Endpoints publics

```bash
# Status
curl http://localhost:5001/api/status

# Liste armoires
curl http://localhost:5001/api/cabinets

# Détail armoire
curl http://localhost:5001/api/cabinets/1
```

- [ ] GET `/api/status` → 200 OK
- [ ] GET `/api/cabinets` → 200 OK avec tableau
- [ ] GET `/api/cabinets/1` → 200 OK avec objet

### Endpoints authentifiés

```bash
# Login
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Avec token
TOKEN="votre_token_jwt"
curl http://localhost:5001/api/users \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] POST `/api/login` → 200 OK avec token
- [ ] GET `/api/users` sans token → 401 Unauthorized
- [ ] GET `/api/users` avec token → 200 OK

## 📊 Vérifications avancées

### Base de données

```sql
-- Vérifier les tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Vérifier les données de test
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM cabinets;
SELECT COUNT(*) FROM tools;

-- Vérifier les index
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public';
```

- [ ] 5 tables créées
- [ ] 3 utilisateurs de test
- [ ] 3 armoires de test
- [ ] 21 outils de test
- [ ] Index sur les colonnes critiques

### Logs

- [ ] Les fichiers de logs sont créés automatiquement
- [ ] Le format des logs est JSON
- [ ] Les logs d'erreur sont dans un fichier séparé
- [ ] Les logs anciens sont supprimés après 30 jours

### Performance

- [ ] Les requêtes API répondent en < 200ms
- [ ] Les images se chargent rapidement
- [ ] Pas de memory leaks (vérifier avec DevTools)
- [ ] Le build frontend est optimisé

## 🌐 Déploiement (production)

### Préparation

- [ ] Variables d'environnement de production configurées
- [ ] Base de données de production créée
- [ ] Scripts SQL exécutés en production
- [ ] Secrets sécurisés (pas en clair)

### Vercel (Frontend)

- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Build réussit
- [ ] Application déployée et accessible

### Railway/Heroku (Backend)

- [ ] Projet créé sur Railway
- [ ] Variables d'environnement configurées
- [ ] Base de données connectée
- [ ] API déployée et accessible

### Tests production

- [ ] Frontend en production accessible
- [ ] Backend en production accessible
- [ ] Connexion à la base de données fonctionne
- [ ] Login/Logout fonctionnent
- [ ] HTTPS activé
- [ ] CORS configuré pour la production

## 🔄 CI/CD

### GitHub Actions

- [ ] Workflow CI/CD configuré
- [ ] Tests backend passent
- [ ] Tests frontend passent
- [ ] Build Docker réussit
- [ ] Scan de sécurité activé

### Automatisation

- [ ] Push sur main déclenche le déploiement
- [ ] Les tests sont obligatoires avant merge
- [ ] Les notifications fonctionnent

## 📱 Fonctionnalités métier

### Utilisateur standard

- [ ] Voir la liste des armoires
- [ ] Voir les détails d'une armoire
- [ ] Effectuer une vérification
- [ ] Voir l'historique des vérifications
- [ ] Se déconnecter

### Administrateur

- [ ] Toutes les fonctions utilisateur
- [ ] Créer une armoire
- [ ] Modifier une armoire
- [ ] Supprimer une armoire
- [ ] Ajouter un outil
- [ ] Modifier un outil
- [ ] Supprimer un outil
- [ ] Voir tous les utilisateurs
- [ ] Gérer les utilisateurs

### Reconnaissance d'images

- [ ] TensorFlow.js se charge
- [ ] Les images peuvent être comparées
- [ ] Le score de similarité est calculé
- [ ] Les zones de différence sont détectées
- [ ] Les outils manquants sont identifiés

## 🎓 Documentation lue

- [ ] [README.md](README.md) - Guide principal
- [ ] [QUICKSTART.md](QUICKSTART.md) - Démarrage rapide
- [ ] [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture technique
- [ ] [DOCKER.md](DOCKER.md) - Guide Docker
- [ ] [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [ ] [CHANGELOG.md](CHANGELOG.md) - Historique des versions
- [ ] [Backend README](backend/README.md) - Documentation API
- [ ] [Frontend README](frontend/README.md) - Documentation React

## ✨ Bonus

- [ ] Les comptes de test fonctionnent
- [ ] Les données de seed sont cohérentes
- [ ] Les images Unsplash se chargent
- [ ] L'interface est responsive
- [ ] Pas d'erreurs dans les logs
- [ ] Les performances sont bonnes

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez le [README.md](README.md)
2. Vérifiez les [Issues GitHub](https://github.com/lucj24720-ai/ArmoireCheck/issues)
3. Relisez cette checklist
4. Ouvrez une nouvelle issue si nécessaire

---

**Légende** :
- ✅ Terminé
- ⏳ En cours
- ❌ Problème

**Progression** : ____ / ____ (remplir au fur et à mesure)
