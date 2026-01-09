-- Script d'initialisation de la base de données ArmoireCheck
-- Base de données PostgreSQL pour gérer les armoires et les outils

-- Suppression des tables existantes (ordre important pour les clés étrangères)
DROP TABLE IF EXISTS missing_tools CASCADE;
DROP TABLE IF EXISTS checks CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS cabinets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des armoires
CREATE TABLE cabinets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    image_url TEXT,
    reference_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des outils
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    cabinet_id INTEGER NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'missing', 'damaged')),
    position_x FLOAT,
    position_y FLOAT,
    position_width FLOAT,
    position_height FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des vérifications
CREATE TABLE checks (
    id SERIAL PRIMARY KEY,
    cabinet_id INTEGER NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    image_url TEXT,
    notes TEXT,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison pour les outils manquants détectés lors d'une vérification
CREATE TABLE missing_tools (
    id SERIAL PRIMARY KEY,
    check_id INTEGER NOT NULL REFERENCES checks(id) ON DELETE CASCADE,
    tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(check_id, tool_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_tools_cabinet_id ON tools(cabinet_id);
CREATE INDEX idx_checks_cabinet_id ON checks(cabinet_id);
CREATE INDEX idx_checks_user_id ON checks(user_id);
CREATE INDEX idx_missing_tools_check_id ON missing_tools(check_id);
CREATE INDEX idx_missing_tools_tool_id ON missing_tools(tool_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cabinets_updated_at BEFORE UPDATE ON cabinets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires sur les tables
COMMENT ON TABLE users IS 'Table des utilisateurs du système';
COMMENT ON TABLE cabinets IS 'Table des armoires gérées par le système';
COMMENT ON TABLE tools IS 'Table des outils contenus dans les armoires';
COMMENT ON TABLE checks IS 'Table des vérifications effectuées sur les armoires';
COMMENT ON TABLE missing_tools IS 'Table de liaison pour les outils manquants détectés lors des vérifications';

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données ArmoireCheck initialisée avec succès';
END $$;
