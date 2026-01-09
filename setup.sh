#!/bin/bash

# Script d'installation automatique pour ArmoireCheck
# Usage: ./setup.sh

set -e  # Arrêter en cas d'erreur

echo "=================================="
echo "  ArmoireCheck - Installation"
echo "=================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js v16 ou supérieur."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js v16 ou supérieur est requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"
echo ""

# Demander les informations de configuration
echo "📋 Configuration de l'application"
echo ""

read -p "URL de la base de données PostgreSQL (Neon ou local): " DATABASE_URL
read -p "Clé publique Clerk (pk_test_...): " CLERK_KEY
read -p "Port du backend [5001]: " BACKEND_PORT
BACKEND_PORT=${BACKEND_PORT:-5001}

# Générer une clé JWT aléatoire
JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

echo ""
echo "⚙️  Installation des dépendances..."
echo ""

# Installation Backend
echo "📦 Installation du backend..."
cd backend
if [ ! -f ".env" ]; then
    cp .env.example .env
    # Mettre à jour le fichier .env
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=$DATABASE_URL|" .env
    sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
    sed -i.bak "s|PORT=.*|PORT=$BACKEND_PORT|" .env
    rm .env.bak 2>/dev/null || true
fi
npm install
echo "✅ Backend configuré"
echo ""

# Installation Frontend
echo "📦 Installation du frontend..."
cd ../frontend
if [ ! -f ".env" ]; then
    cp .env.example .env
    # Mettre à jour le fichier .env
    sed -i.bak "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=http://localhost:$BACKEND_PORT/api|" .env
    sed -i.bak "s|REACT_APP_CLERK_PUBLISHABLE_KEY=.*|REACT_APP_CLERK_PUBLISHABLE_KEY=$CLERK_KEY|" .env
    rm .env.bak 2>/dev/null || true
fi
npm install
echo "✅ Frontend configuré"
echo ""

cd ..

# Initialisation de la base de données
echo "🗄️  Initialisation de la base de données..."
read -p "Voulez-vous initialiser la base de données maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v psql &> /dev/null; then
        echo "Exécution du script d'initialisation..."
        psql "$DATABASE_URL" -f backend/database/init.sql
        echo "✅ Base de données initialisée"

        read -p "Voulez-vous ajouter des données de test? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            psql "$DATABASE_URL" -f backend/database/seed.sql
            echo "✅ Données de test ajoutées"
        fi
    else
        echo "⚠️  psql n'est pas installé. Vous devrez initialiser la base de données manuellement:"
        echo "   psql \$DATABASE_URL -f backend/database/init.sql"
        echo "   psql \$DATABASE_URL -f backend/database/seed.sql"
    fi
fi

echo ""
echo "=================================="
echo "  ✅ Installation terminée!"
echo "=================================="
echo ""
echo "Pour démarrer l'application:"
echo ""
echo "1. Terminal 1 - Backend:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "L'application sera accessible sur http://localhost:3000"
echo ""

if [ -f "backend/database/seed.sql" ]; then
    echo "Comptes de test (si données de test installées):"
    echo "  Admin - username: admin, password: admin123"
    echo "  User  - username: user1, password: user123"
    echo ""
fi

echo "Pour plus d'informations, consultez README.md"
echo ""
