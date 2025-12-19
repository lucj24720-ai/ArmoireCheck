const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Configuration de la base de données Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware pour vérifier la connexion à la base de données
const checkDatabaseConnection = async (req, res, next) => {
  try {
    await pool.query('SELECT NOW()');
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection error' });
  }
};

// Middleware pour vérifier l'authentification
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware pour vérifier le rôle admin
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Route pour vérifier l'état de l'API
app.get('/api/status', checkDatabaseConnection, (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Route pour obtenir la liste des armoires
app.get('/api/cabinets', checkDatabaseConnection, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cabinets');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching cabinets:', error);
    res.status(500).json({ error: 'Error fetching cabinets' });
  }
});

// Route pour obtenir les détails d'une armoire spécifique
app.get('/api/cabinets/:id', checkDatabaseConnection, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM cabinets WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching cabinet:', error);
    res.status(500).json({ error: 'Error fetching cabinet' });
  }
});

// Route pour ajouter une armoire
app.post('/api/cabinets', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { name, description, location, image_url } = req.body;
  
  // Validation des entrées
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO cabinets (name, description, location, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, location, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating cabinet:', error);
    res.status(500).json({ error: 'Error creating cabinet' });
  }
});

// Route pour mettre à jour une armoire
app.put('/api/cabinets/:id', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, location, image_url } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE cabinets SET name = $1, description = $2, location = $3, image_url = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, description, location, image_url, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating cabinet:', error);
    res.status(500).json({ error: 'Error updating cabinet' });
  }
});

// Route pour supprimer une armoire
app.delete('/api/cabinets/:id', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM cabinets WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cabinet not found' });
    }
    
    res.json({ message: 'Cabinet deleted successfully', cabinet: result.rows[0] });
  } catch (error) {
    console.error('Error deleting cabinet:', error);
    res.status(500).json({ error: 'Error deleting cabinet' });
  }
});

// Route pour obtenir les outils d'une armoire
app.get('/api/cabinets/:id/tools', checkDatabaseConnection, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tools WHERE cabinet_id = $1', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Error fetching tools' });
  }
});

// Route pour obtenir tous les outils
app.get('/api/tools', checkDatabaseConnection, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tools');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Error fetching tools' });
  }
});

// Route pour obtenir un outil spécifique
app.get('/api/tools/:id', checkDatabaseConnection, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM tools WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tool:', error);
    res.status(500).json({ error: 'Error fetching tool' });
  }
});

// Route pour ajouter un outil
app.post('/api/tools', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { cabinetId, name, description, quantity, image_url } = req.body;
  
  // Validation des entrées
  if (!cabinetId || !name) {
    return res.status(400).json({ error: 'Cabinet ID and name are required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO tools (cabinet_id, name, description, quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cabinetId, name, description, quantity || 1, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tool:', error);
    res.status(500).json({ error: 'Error creating tool' });
  }
});

// Route pour mettre à jour un outil
app.put('/api/tools/:id', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { cabinetId, name, description, quantity, image_url, status } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE tools SET cabinet_id = $1, name = $2, description = $3, quantity = $4, image_url = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [cabinetId, name, description, quantity, image_url, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tool:', error);
    res.status(500).json({ error: 'Error updating tool' });
  }
});

// Route pour supprimer un outil
app.delete('/api/tools/:id', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM tools WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    
    res.json({ message: 'Tool deleted successfully', tool: result.rows[0] });
  } catch (error) {
    console.error('Error deleting tool:', error);
    res.status(500).json({ error: 'Error deleting tool' });
  }
});

// Route pour obtenir tous les utilisateurs
app.get('/api/users', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Route pour obtenir un utilisateur spécifique
app.get('/api/users/:id', checkDatabaseConnection, authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Vérifier si l'utilisateur a le droit d'accéder à ces informations
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Route pour ajouter un utilisateur
app.post('/api/users', checkDatabaseConnection, async (req, res) => {
  const { username, email, password, role } = req.body;
  
  // Validation des entrées
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  
  try {
    // Hachage du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, passwordHash, role || 'user']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Route pour mettre à jour un utilisateur
app.put('/api/users/:id', checkDatabaseConnection, authenticate, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  
  // Vérifier si l'utilisateur a le droit de modifier ce compte
  if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  try {
    let passwordHash = undefined;
    
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }
    
    const result = await pool.query(
      'UPDATE users SET username = $1, email = $2, password_hash = COALESCE($3, password_hash), role = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, username, email, role',
      [username, email, passwordHash, role, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Route pour supprimer un utilisateur
app.delete('/api/users/:id', checkDatabaseConnection, authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email, role', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Route pour la connexion
app.post('/api/login', checkDatabaseConnection, async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Vérification du mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Route pour créer une vérification
app.post('/api/checks', checkDatabaseConnection, authenticate, async (req, res) => {
  const { cabinetId, image, missingTools, notes } = req.body;
  
  if (!cabinetId) {
    return res.status(400).json({ error: 'Cabinet ID is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO checks (cabinet_id, user_id, status, image_url, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [cabinetId, req.user.id, 'completed', image, notes]
    );
    
    const checkId = result.rows[0].id;
    
    // Ajouter les outils manquants
    if (missingTools && missingTools.length > 0) {
      for (const toolId of missingTools) {
        await pool.query(
          'INSERT INTO missing_tools (check_id, tool_id) VALUES ($1, $2)',
          [checkId, toolId]
        );
      }
    }
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating check:', error);
    res.status(500).json({ error: 'Error creating check' });
  }
});

// Route pour obtenir les vérifications d'une armoire
app.get('/api/cabinets/:id/checks', checkDatabaseConnection, authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM checks WHERE cabinet_id = $1 ORDER BY check_date DESC', [id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching checks:', error);
    res.status(500).json({ error: 'Error fetching checks' });
  }
});

// Route pour obtenir les détails d'une vérification spécifique
app.get('/api/checks/:id', checkDatabaseConnection, authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const checkResult = await pool.query('SELECT * FROM checks WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Check not found' });
    }
    
    const check = checkResult.rows[0];
    
    // Vérifier si l'utilisateur a le droit d'accéder à cette vérification
    if (req.user.id !== check.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Obtenir les outils manquants pour cette vérification
    const missingToolsResult = await pool.query(
      'SELECT t.* FROM missing_tools mt JOIN tools t ON mt.tool_id = t.id WHERE mt.check_id = $1',
      [id]
    );
    
    res.json({
      ...check,
      missingTools: missingToolsResult.rows
    });
  } catch (error) {
    console.error('Error fetching check:', error);
    res.status(500).json({ error: 'Error fetching check' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;