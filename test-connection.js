#!/usr/bin/env node

/**
 * Script de test de connexion à la base de données
 * Vérifie que la DATABASE_URL fonctionne correctement
 */

require('dotenv').config({ path: './backend/.env' });
const { Pool } = require('pg');

console.log('\n========================================');
console.log('Test de connexion a la base de donnees');
console.log('========================================\n');

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERREUR: DATABASE_URL non definie dans backend/.env');
  console.log('\nAssurez-vous que le fichier backend/.env existe et contient:');
  console.log('DATABASE_URL=postgres://...\n');
  process.exit(1);
}

// Masquer le mot de passe dans l'affichage
const urlWithHiddenPassword = databaseUrl.replace(/:([^@]+)@/, ':****@');
console.log('DATABASE_URL configure: ' + urlWithHiddenPassword + '\n');

console.log('Tentative de connexion...\n');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    // Test 1: Connexion simple
    console.log('[1/4] Test de connexion...');
    const client = await pool.connect();
    console.log('      OK - Connexion reussie!\n');

    // Test 2: Version PostgreSQL
    console.log('[2/4] Verification de la version PostgreSQL...');
    const versionResult = await client.query('SELECT version()');
    const version = versionResult.rows[0].version.split(' ')[1];
    console.log('      OK - PostgreSQL version: ' + version + '\n');

    // Test 3: Vérifier les tables
    console.log('[3/4] Verification des tables...');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length === 0) {
      console.log('      ATTENTION - Aucune table trouvee!');
      console.log('      Vous devez executer les scripts SQL:');
      console.log('      - backend/database/init.sql');
      console.log('      - backend/database/seed.sql\n');
    } else {
      console.log('      OK - Tables trouvees:');
      tablesResult.rows.forEach(row => {
        console.log('         - ' + row.table_name);
      });
      console.log('');
    }

    // Test 4: Vérifier les données de test
    console.log('[4/4] Verification des donnees de test...');

    if (tablesResult.rows.length > 0) {
      const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
      const cabinetsResult = await client.query('SELECT COUNT(*) as count FROM cabinets');
      const toolsResult = await client.query('SELECT COUNT(*) as count FROM tools');

      const usersCount = parseInt(usersResult.rows[0].count);
      const cabinetsCount = parseInt(cabinetsResult.rows[0].count);
      const toolsCount = parseInt(toolsResult.rows[0].count);

      console.log('      OK - Donnees presentes:');
      console.log('         - Utilisateurs: ' + usersCount);
      console.log('         - Armoires: ' + cabinetsCount);
      console.log('         - Outils: ' + toolsCount);
      console.log('');

      if (usersCount === 0) {
        console.log('      ATTENTION - Aucun utilisateur trouve!');
        console.log('      Executez: backend/database/seed.sql\n');
      }
    }

    client.release();

    console.log('========================================');
    console.log('RESULTAT: Tous les tests ont reussi!');
    console.log('========================================\n');
    console.log('Votre base de donnees est prete!');
    console.log('Vous pouvez demarrer l\'application:\n');
    console.log('  Terminal 1: cd backend && npm run dev');
    console.log('  Terminal 2: cd frontend && npm start\n');

    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('ERREUR: Echec de la connexion');
    console.error('========================================\n');
    console.error('Message d\'erreur:', error.message);
    console.error('\nCode d\'erreur:', error.code);

    console.log('\nSolutions possibles:\n');

    if (error.code === 'ENOTFOUND') {
      console.log('1. Verifiez que vous avez bien copie toute la connection string');
      console.log('2. Verifiez votre connexion Internet');
      console.log('3. Verifiez que l\'URL Neon est correcte\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('1. Si vous utilisez PostgreSQL local, verifiez qu\'il est demarre');
      console.log('2. Recommandation: Utilisez Neon (voir GUIDE_NEON.md)\n');
    } else if (error.message.includes('password')) {
      console.log('1. Verifiez la connection string dans backend/.env');
      console.log('2. Copiez-collez la connection string complete depuis Neon');
      console.log('3. N\'incluez pas d\'espaces avant ou apres l\'URL\n');
    } else {
      console.log('1. Verifiez le fichier backend/.env');
      console.log('2. Consultez GUIDE_NEON.md pour la configuration');
      console.log('3. Consultez TROUBLESHOOTING.md pour plus d\'aide\n');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
