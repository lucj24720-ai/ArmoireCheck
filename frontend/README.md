# ArmoireCheck Frontend

Application React pour la gestion visuelle des armoires à outils avec reconnaissance d'images.

## Configuration rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copier `.env.example` vers `.env` et remplir les valeurs :

```bash
cp .env.example .env
```

Configurer les variables :
- `REACT_APP_API_URL` : URL du backend (ex: `http://localhost:5001/api`)
- `REACT_APP_CLERK_PUBLISHABLE_KEY` : Clé publique Clerk

### 3. Démarrage

```bash
# Mode développement
npm start

# Build pour production
npm run build
```

L'application démarre sur `http://localhost:3000`

## Structure des dossiers

```
frontend/
├── src/
│   ├── App.js                   # Composant racine
│   ├── index.js                 # Point d'entrée
│   ├── components/
│   │   └── Navbar.js           # Barre de navigation
│   ├── pages/
│   │   ├── HomePage.js         # Page d'accueil
│   │   ├── LoginPage.js        # Connexion
│   │   ├── SignUpPage.js       # Inscription
│   │   ├── CabinetListPage.js  # Liste des armoires
│   │   ├── CabinetDetailPage.js # Détails d'une armoire
│   │   ├── CheckPage.js        # Vérification d'armoire
│   │   └── AdminPage.js        # Panel admin
│   └── services/
│       ├── api.js              # Service API
│       └── imageRecognition.js # Reconnaissance d'images
├── public/
│   ├── index.html
│   └── ...
├── .env                        # Variables d'environnement (ne pas commiter)
├── .env.example                # Template des variables
└── package.json
```

## Fonctionnalités

### Pages utilisateur

1. **Page d'accueil** (`/`)
   - Présentation de l'application
   - Liens vers les fonctionnalités principales

2. **Liste des armoires** (`/cabinets`)
   - Affichage en grille de toutes les armoires
   - Recherche et filtrage
   - Aperçu rapide

3. **Détails d'une armoire** (`/cabinets/:id`)
   - Informations complètes sur l'armoire
   - Liste des outils
   - Historique des vérifications
   - Bouton pour lancer une vérification

4. **Vérification** (`/check/:id`)
   - Capture d'image via webcam
   - Comparaison avec image de référence
   - Détection des outils manquants
   - Affichage des résultats

### Pages administrateur

5. **Panel admin** (`/admin`)
   - Gestion des armoires
   - Gestion des outils
   - Gestion des utilisateurs
   - Statistiques globales

### Services

#### Service API (`services/api.js`)

Gère toutes les communications avec le backend :

```javascript
import { authService, cabinetService, toolService } from './services/api';

// Authentification
await authService.login(username, password);
const user = authService.getCurrentUser();

// Armoires
const cabinets = await cabinetService.getAll();
const cabinet = await cabinetService.getById(id);

// Outils
const tools = await toolService.getAll();
```

#### Service de reconnaissance d'images (`services/imageRecognition.js`)

Utilise TensorFlow.js pour l'analyse :

```javascript
import imageRecognitionService from './services/imageRecognition';

// Analyser une image
const result = await imageRecognitionService.analyzeImage(
  referenceImageUrl,
  capturedImageUrl,
  tools
);

// Résultat contient :
// - similarityScore: Score de similarité (0-1)
// - confidenceScore: Confiance de la détection
// - missingTools: Liste des outils manquants
// - differenceRegions: Zones de différence
```

## Composants principaux

### Navbar

Barre de navigation responsive avec :
- Logo et titre de l'application
- Liens de navigation
- Menu utilisateur
- Bouton de déconnexion

### Pages

Chaque page est un composant React indépendant avec :
- Gestion de l'état local
- Appels API
- Gestion des erreurs
- Interface Material-UI

## Thème et style

L'application utilise Material-UI avec un thème personnalisé :

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
});
```

## Authentification

Deux systèmes d'authentification sont disponibles :

1. **JWT Backend** : Authentification classique avec le backend
2. **Clerk** : Authentification avancée avec gestion complète

### Utilisation de Clerk

```javascript
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react';

// Dans un composant
const { user } = useUser();

// Routes protégées
<SignedIn>
  <AdminPage />
</SignedIn>
<SignedOut>
  <RedirectToSignIn />
</SignedOut>
```

## Reconnaissance d'images

Le système utilise TensorFlow.js pour :

1. **Comparaison d'images**
   - Charge l'image de référence
   - Capture l'image actuelle
   - Calcule les différences pixel par pixel

2. **Détection des zones**
   - Divise l'image en grille
   - Identifie les zones de différence
   - Calcule un score de confiance

3. **Identification des outils manquants**
   - Compare les positions des outils
   - Croise avec les zones de différence
   - Retourne la liste des outils probablement manquants

## Scripts npm

- `npm start` - Démarrer en développement
- `npm run build` - Build pour production
- `npm test` - Lancer les tests
- `npm run eject` - Ejecter la configuration (irréversible)

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL de l'API backend | `http://localhost:5001/api` |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | Clé publique Clerk | `pk_test_...` |

## Déploiement

### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
vercel

# Configuration
# Ajouter les variables d'environnement dans le dashboard Vercel
```

### Build manuel

```bash
# Créer le build
npm run build

# Le dossier build/ contient les fichiers statiques
# À déployer sur n'importe quel serveur web
```

## Gestion des erreurs

Le service API gère automatiquement :
- Erreurs réseau
- Erreurs serveur (500)
- Erreurs d'authentification (401)
- Erreurs de validation (400)
- Déconnexion automatique si token expiré

## Performance

Optimisations incluses :
- Lazy loading des images
- Mise en cache des requêtes API
- Timeout des requêtes (10s)
- Gestion efficace de la mémoire avec TensorFlow.js

## Accessibilité

L'application respecte les normes WCAG :
- Navigation au clavier
- Labels ARIA
- Contraste des couleurs
- Taille de texte responsive

## Browser Support

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

## Troubleshooting

### Erreur CORS
Vérifier que le backend a CORS activé pour l'URL du frontend.

### TensorFlow.js ne charge pas
Vérifier la connexion internet et les erreurs console.

### Images ne s'affichent pas
Vérifier les URLs et les permissions CORS des images.

### Clerk ne fonctionne pas
Vérifier que `REACT_APP_CLERK_PUBLISHABLE_KEY` est correctement configurée.
