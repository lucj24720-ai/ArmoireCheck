# Guide de contribution - ArmoireCheck

Merci de votre intérêt pour contribuer à ArmoireCheck! Ce document vous guidera à travers le processus de contribution.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Structure du projet](#structure-du-projet)
- [Standards de code](#standards-de-code)
- [Processus de développement](#processus-de-développement)
- [Soumettre une contribution](#soumettre-une-contribution)

## Code de conduite

En participant à ce projet, vous acceptez de maintenir un environnement respectueux et inclusif pour tous.

## Comment contribuer

Il existe plusieurs façons de contribuer :

### 🐛 Signaler un bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/lucj24720-ai/ArmoireCheck/issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs comportement observé
   - Captures d'écran si applicable
   - Environnement (OS, navigateur, versions)

### 💡 Proposer une fonctionnalité

1. Vérifier qu'elle n'est pas déjà proposée
2. Créer une issue avec le template "Feature Request"
3. Expliquer :
   - Le besoin/problème à résoudre
   - La solution proposée
   - Les alternatives envisagées
   - Les impacts potentiels

### 📝 Améliorer la documentation

- Corriger des erreurs
- Clarifier des sections confuses
- Ajouter des exemples
- Traduire la documentation

### 💻 Contribuer au code

Voir la section [Processus de développement](#processus-de-développement)

## Structure du projet

```
ArmoireCheck/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── index.js        # Point d'entrée
│   │   └── middleware/     # Middlewares personnalisés
│   └── database/           # Scripts SQL
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   └── services/      # Services (API, reconnaissance)
│   └── public/
│
└── docs/                  # Documentation (à créer)
```

## Standards de code

### JavaScript/React

- **Style** : Suivre les conventions JavaScript standard
- **Indentation** : 2 espaces
- **Quotes** : Guillemets simples pour JavaScript, guillemets doubles pour JSX
- **Semicolons** : Obligatoires
- **Naming** :
  - camelCase pour les variables et fonctions
  - PascalCase pour les composants React
  - SCREAMING_SNAKE_CASE pour les constantes

### Exemples

```javascript
// ✅ Bon
const userName = 'John';
const API_URL = 'http://localhost:5001';

function getUserData(userId) {
  return fetch(`${API_URL}/users/${userId}`);
}

// ❌ Éviter
const user_name = 'John';
const apiUrl = 'http://localhost:5001';

function get_user_data(user_id) {
  return fetch(apiUrl + '/users/' + user_id);
}
```

### Composants React

```javascript
// ✅ Bon
import React from 'react';

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
    </div>
  );
}

export default UserProfile;
```

### Gestion des erreurs

```javascript
// ✅ Bon
try {
  const data = await apiService.getData();
  setData(data);
} catch (error) {
  console.error('Error fetching data:', error);
  setError(error.message);
}

// ❌ Éviter
const data = await apiService.getData(); // Pas de gestion d'erreur
```

### Backend

- Utiliser les middlewares pour la logique réutilisable
- Valider toutes les entrées utilisateur
- Logger les erreurs importantes
- Utiliser les codes HTTP appropriés

```javascript
// ✅ Bon
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    throw ErrorTypes.BAD_REQUEST('Invalid user ID');
  }

  const user = await userService.getById(id);

  if (!user) {
    throw ErrorTypes.NOT_FOUND('User not found');
  }

  res.json(user);
}));
```

## Processus de développement

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub, puis :
git clone https://github.com/VOTRE_USERNAME/ArmoireCheck.git
cd ArmoireCheck
git remote add upstream https://github.com/lucj24720-ai/ArmoireCheck.git
```

### 2. Créer une branche

```bash
# Toujours créer une branche depuis main
git checkout main
git pull upstream main
git checkout -b feature/ma-nouvelle-fonctionnalite

# Ou pour un bug fix
git checkout -b fix/correction-du-bug
```

Conventions de nommage des branches :
- `feature/description` : Nouvelles fonctionnalités
- `fix/description` : Corrections de bugs
- `docs/description` : Modifications de documentation
- `refactor/description` : Refactoring de code
- `test/description` : Ajout de tests

### 3. Développer

```bash
# Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# Configurer l'environnement
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Éditer les fichiers .env

# Démarrer en mode développement
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### 4. Tester

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### 5. Commit

Suivre les [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format : <type>(<scope>): <description>

git add .
git commit -m "feat(cabinet): add delete confirmation dialog"
git commit -m "fix(api): handle null values in user response"
git commit -m "docs(readme): update installation instructions"
```

Types de commits :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage (ne change pas le code)
- `refactor` : Refactoring
- `test` : Ajout de tests
- `chore` : Tâches de maintenance

### 6. Push

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

## Soumettre une contribution

### Pull Request

1. Aller sur GitHub et créer une Pull Request
2. Remplir le template de PR :
   - Description claire des changements
   - Lien vers l'issue associée
   - Captures d'écran si UI modifiée
   - Tests effectués

3. S'assurer que :
   - Le code compile sans erreurs
   - Les tests passent
   - La documentation est à jour
   - Le code suit les standards

4. Attendre la review :
   - Répondre aux commentaires
   - Effectuer les modifications demandées
   - Mettre à jour la PR

### Checklist avant soumission

- [ ] Le code compile sans erreurs
- [ ] Les tests passent
- [ ] La documentation est à jour
- [ ] Les commits suivent les conventions
- [ ] Pas de fichiers de configuration personnels (.env, etc.)
- [ ] Pas de console.log() oubliés
- [ ] Le code est formaté correctement

### Review Process

1. Un mainteneur reviewera votre PR
2. Des changements peuvent être demandés
3. Une fois approuvée, la PR sera mergée
4. Votre contribution sera dans la prochaine release !

## Questions ?

- Ouvrir une [Discussion](https://github.com/lucj24720-ai/ArmoireCheck/discussions)
- Poser une question dans une issue
- Contacter les mainteneurs

## Reconnaissance

Tous les contributeurs seront mentionnés dans le fichier CONTRIBUTORS.md et dans les release notes.

Merci de contribuer à ArmoireCheck ! 🙏
