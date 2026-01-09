#!/usr/bin/env node

/**
 * Script de vérification de l'installation ArmoireCheck
 * Diagnostique les problèmes courants et propose des solutions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de l'installation ArmoireCheck...\n');

const checks = [];
let hasErrors = false;

// Fonction helper pour exécuter des commandes
function runCommand(command, silent = true) {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit'
    }).trim();
  } catch (error) {
    return null;
  }
}

// Fonction helper pour vérifier
function check(name, test, solution) {
  process.stdout.write(`Checking ${name}... `);
  const result = test();

  if (result.success) {
    console.log('✅ OK' + (result.message ? ` (${result.message})` : ''));
    checks.push({ name, status: 'OK', message: result.message });
  } else {
    console.log('❌ FAIL' + (result.message ? ` (${result.message})` : ''));
    console.log(`   → Solution: ${solution}\n`);
    checks.push({ name, status: 'FAIL', message: result.message, solution });
    hasErrors = true;
  }
}

console.log('═══════════════════════════════════════════════════\n');
console.log('📋 PRÉREQUIS\n');

// 1. Node.js
check(
  'Node.js version',
  () => {
    const version = runCommand('node --version');
    if (!version) return { success: false, message: 'Non installé' };

    const major = parseInt(version.slice(1).split('.')[0]);
    if (major < 16) {
      return { success: false, message: `Version ${version} trop ancienne` };
    }
    return { success: true, message: version };
  },
  'Installer Node.js v16+ depuis https://nodejs.org/'
);

// 2. npm
check(
  'npm version',
  () => {
    const version = runCommand('npm --version');
    if (!version) return { success: false, message: 'Non installé' };
    return { success: true, message: version };
  },
  'npm est normalement installé avec Node.js'
);

// 3. Git
check(
  'Git',
  () => {
    const version = runCommand('git --version');
    if (!version) return { success: false, message: 'Non installé (optionnel)' };
    return { success: true, message: version.split(' ')[2] };
  },
  'Optionnel : https://git-scm.com/downloads'
);

console.log('\n═══════════════════════════════════════════════════\n');
console.log('📦 DÉPENDANCES\n');

// 4. Backend node_modules
check(
  'Backend dependencies',
  () => {
    const exists = fs.existsSync(path.join(__dirname, 'backend', 'node_modules'));
    if (!exists) return { success: false, message: 'Non installées' };

    // Vérifier quelques packages critiques
    const critical = ['express', 'pg', 'joi', 'jest'];
    for (const pkg of critical) {
      if (!fs.existsSync(path.join(__dirname, 'backend', 'node_modules', pkg))) {
        return { success: false, message: `${pkg} manquant` };
      }
    }
    return { success: true, message: 'Installées' };
  },
  'cd backend && npm install'
);

// 5. Frontend node_modules
check(
  'Frontend dependencies',
  () => {
    const exists = fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'));
    if (!exists) return { success: false, message: 'Non installées' };
    return { success: true, message: 'Installées' };
  },
  'cd frontend && npm install'
);

console.log('\n═══════════════════════════════════════════════════\n');
console.log('⚙️  CONFIGURATION\n');

// 6. Backend .env
check(
  'Backend .env file',
  () => {
    const envPath = path.join(__dirname, 'backend', '.env');
    if (!fs.existsSync(envPath)) {
      return { success: false, message: 'Fichier manquant' };
    }

    const content = fs.readFileSync(envPath, 'utf-8');
    const hasDbUrl = content.includes('DATABASE_URL=') && !content.includes('DATABASE_URL=postgres://user:password@localhost');
    const hasJwtSecret = content.includes('JWT_SECRET=') && !content.includes('your_jwt_secret_key_here');

    if (!hasDbUrl) {
      return { success: false, message: 'DATABASE_URL non configuré' };
    }
    if (!hasJwtSecret) {
      return { success: false, message: 'JWT_SECRET non configuré' };
    }

    return { success: true, message: 'Configuré' };
  },
  'cp backend/.env.example backend/.env puis éditer avec vos valeurs'
);

// 7. Frontend .env
check(
  'Frontend .env file',
  () => {
    const envPath = path.join(__dirname, 'frontend', '.env');
    if (!fs.existsSync(envPath)) {
      return { success: false, message: 'Fichier manquant' };
    }

    const content = fs.readFileSync(envPath, 'utf-8');
    const hasApiUrl = content.includes('REACT_APP_API_URL=');
    const hasClerkKey = content.includes('REACT_APP_CLERK_PUBLISHABLE_KEY=');

    if (!hasApiUrl) {
      return { success: false, message: 'REACT_APP_API_URL manquant' };
    }
    if (!hasClerkKey) {
      return { success: false, message: 'REACT_APP_CLERK_PUBLISHABLE_KEY manquant' };
    }

    return { success: true, message: 'Configuré' };
  },
  'cp frontend/.env.example frontend/.env puis éditer'
);

console.log('\n═══════════════════════════════════════════════════\n');
console.log('🐳 DOCKER (Optionnel)\n');

// 8. Docker
check(
  'Docker',
  () => {
    const version = runCommand('docker --version');
    if (!version) return { success: false, message: 'Non installé (optionnel)' };
    return { success: true, message: version.split(' ')[2] };
  },
  'Optionnel : https://www.docker.com/products/docker-desktop'
);

// 9. Docker Compose
check(
  'Docker Compose',
  () => {
    const version = runCommand('docker-compose --version');
    if (!version) return { success: false, message: 'Non installé (optionnel)' };
    return { success: true, message: version.split(' ')[3] };
  },
  'Inclus avec Docker Desktop'
);

console.log('\n═══════════════════════════════════════════════════\n');
console.log('💾 BASE DE DONNÉES\n');

// 10. PostgreSQL
check(
  'PostgreSQL',
  () => {
    const version = runCommand('psql --version');
    if (!version) {
      return { success: false, message: 'Non installé (utilisez Docker ou Neon)' };
    }
    return { success: true, message: version.split(' ')[2] };
  },
  'Option 1: docker-compose up -d\nOption 2: https://neon.tech (cloud gratuit)\nOption 3: https://www.postgresql.org/download/'
);

console.log('\n═══════════════════════════════════════════════════\n');

// Résumé
console.log('📊 RÉSUMÉ\n');

const total = checks.length;
const passed = checks.filter(c => c.status === 'OK').length;
const failed = total - passed;

console.log(`Total des vérifications : ${total}`);
console.log(`✅ Réussies : ${passed}`);
console.log(`❌ Échouées : ${failed}\n`);

if (hasErrors) {
  console.log('⚠️  ACTIONS REQUISES :\n');

  const failures = checks.filter(c => c.status === 'FAIL');
  failures.forEach((check, index) => {
    console.log(`${index + 1}. ${check.name}`);
    console.log(`   Problème: ${check.message}`);
    console.log(`   Solution: ${check.solution}\n`);
  });

  console.log('═══════════════════════════════════════════════════\n');
  console.log('🚀 PROCHAINES ÉTAPES RECOMMANDÉES :\n');

  // Recommandation intelligente
  const hasDocker = checks.find(c => c.name === 'Docker' && c.status === 'OK');
  const hasPostgres = checks.find(c => c.name === 'PostgreSQL' && c.status === 'OK');

  if (hasDocker) {
    console.log('Vous avez Docker ! Solution la plus simple :');
    console.log('');
    console.log('  docker-compose up -d');
    console.log('');
    console.log('Puis ouvrir http://localhost:3000');
  } else if (!hasPostgres) {
    console.log('PostgreSQL non détecté. Options :');
    console.log('');
    console.log('Option 1 (Recommandée) - Utiliser Neon (cloud gratuit):');
    console.log('  1. Créer compte sur https://neon.tech');
    console.log('  2. Copier la connection string');
    console.log('  3. Éditer backend/.env avec votre DATABASE_URL');
    console.log('  4. cd backend && npm run dev');
    console.log('');
    console.log('Option 2 - Installer Docker Desktop:');
    console.log('  1. https://www.docker.com/products/docker-desktop');
    console.log('  2. docker-compose up -d');
    console.log('');
    console.log('Option 3 - Installer PostgreSQL localement:');
    console.log('  1. https://www.postgresql.org/download/');
    console.log('  2. Suivre TROUBLESHOOTING.md');
  } else {
    console.log('Résoudre les problèmes ci-dessus puis :');
    console.log('');
    console.log('  cd backend && npm run dev');
    console.log('  cd frontend && npm start');
  }

  console.log('');
  console.log('📖 Voir TROUBLESHOOTING.md pour plus de détails');
  console.log('📖 Voir START_HERE.md pour le guide de démarrage');

  process.exit(1);
} else {
  console.log('🎉 INSTALLATION PARFAITE !\n');
  console.log('Tout est prêt. Pour démarrer :\n');
  console.log('Option 1 - Avec Docker:');
  console.log('  docker-compose up -d');
  console.log('  Puis ouvrir http://localhost:3000\n');
  console.log('Option 2 - Manuel:');
  console.log('  Terminal 1: cd backend && npm run dev');
  console.log('  Terminal 2: cd frontend && npm start\n');
  console.log('Connexion:');
  console.log('  Admin: admin / admin123');
  console.log('  User:  user1 / user123\n');
  console.log('📖 Voir START_HERE.md pour plus d\'informations');

  process.exit(0);
}
