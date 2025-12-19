-- Script SQL pour créer les tables de la base de données ArmoireCheck

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des armoires
CREATE TABLE IF NOT EXISTS cabinets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  location VARCHAR(100),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des outils
CREATE TABLE IF NOT EXISTS tools (
  id SERIAL PRIMARY KEY,
  cabinet_id INTEGER REFERENCES cabinets(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des vérifications
CREATE TABLE IF NOT EXISTS checks (
  id SERIAL PRIMARY KEY,
  cabinet_id INTEGER REFERENCES cabinets(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL,
  notes TEXT,
  image_url VARCHAR(255)
);

-- Table des outils manquants
CREATE TABLE IF NOT EXISTS missing_tools (
  id SERIAL PRIMARY KEY,
  check_id INTEGER REFERENCES checks(id) ON DELETE CASCADE,
  tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  notes TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cabinets_name ON cabinets(name);
CREATE INDEX IF NOT EXISTS idx_tools_cabinet_id ON tools(cabinet_id);
CREATE INDEX IF NOT EXISTS idx_checks_cabinet_id ON checks(cabinet_id);
CREATE INDEX IF NOT EXISTS idx_checks_user_id ON checks(user_id);

-- Données initiales pour les tests
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('user1', 'user1@example.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO cabinets (name, description, location) VALUES
('Armoire Principale', 'Armoire principale contenant les outils essentiels', 'Atelier 1'),
('Armoire Secondaire', 'Armoire secondaire pour les outils spécialisés', 'Atelier 2');

INSERT INTO tools (cabinet_id, name, description, quantity) VALUES
(1, 'Tournevis', 'Tournevis cruciforme', 5),
(1, 'Marteau', 'Marteau de menuisier', 3),
(2, 'Clé à molette', 'Clé à molette réglable', 2);