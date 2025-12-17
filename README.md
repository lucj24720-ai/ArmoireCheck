# ArmoireCheck

Une application moderne pour gérer et contrôler les outils dans une armoire. Cette application permet de détecter les outils manquants après utilisation en utilisant la reconnaissance d'images.

## Fonctionnalités

- **Reconnaissance d'images** : Détecte les outils manquants en comparant une image de référence avec une image actuelle.
- **Gestion des rôles** : Deux rôles principaux, administrateur et utilisateur, avec des permissions spécifiques.
- **Multi-armoires** : Prise en charge de plusieurs armoires pour une gestion centralisée.
- **Interface moderne** : Design responsive et intuitif pour une expérience utilisateur optimale.

## Technologies

- **Frontend** : React.js avec TypeScript
- **Backend** : Node.js avec Express
- **Base de données** : Neon (PostgreSQL)
- **Reconnaissance d'images** : TensorFlow.js ou une API de vision par ordinateur
- **Déploiement** : Vercel

## Architecture

L'application suit une architecture modulaire avec une séparation claire entre le frontend et le backend. Le backend expose une API RESTful pour gérer les données des armoires et des outils, tandis que le frontend fournit une interface utilisateur interactive.

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/lucj24720-ai/ArmoireCheck.git
   ```

2. Installer les dépendances pour le backend et le frontend.

3. Configurer la base de données Neon et mettre à jour les informations de connexion dans le fichier de configuration.

4. Lancer l'application en mode développement ou production.

## Utilisation

- **Administrateur** : Peut ajouter/supprimer des armoires, gérer les utilisateurs et configurer les outils.
- **Utilisateur** : Peut scanner les armoires pour détecter les outils manquants et signaler les problèmes.

## Déploiement

L'application est déployée sur Vercel pour une mise à disposition facile et rapide.

## Contribution

Les contributions sont les bienvenues. Veuillez ouvrir une issue ou une pull request pour toute amélioration ou correction.

## Licence

Ce projet est sous licence MIT.