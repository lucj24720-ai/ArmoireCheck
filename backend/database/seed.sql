-- Script de données de test pour ArmoireCheck
-- Ce script ajoute des données de démonstration à la base de données

-- Insertion d'utilisateurs de test
-- Mot de passe pour admin : admin123 (hash bcrypt avec salt rounds = 10)
-- Mot de passe pour user : user123 (hash bcrypt avec salt rounds = 10)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@armoirecheck.com', '$2b$10$rKZw8kH8Y0GF9gX3kNw0OuDNpHxV5L8YZ1GxQz6vW8X9Y0HZ1KZ2e', 'admin'),
('user1', 'user1@armoirecheck.com', '$2b$10$rKZw8kH8Y0GF9gX3kNw0OuDNpHxV5L8YZ1GxQz6vW8X9Y0HZ1KZ2e', 'user'),
('user2', 'user2@armoirecheck.com', '$2b$10$rKZw8kH8Y0GF9gX3kNw0OuDNpHxV5L8YZ1GxQz6vW8X9Y0HZ1KZ2e', 'user');

-- Insertion d'armoires de test
INSERT INTO cabinets (name, description, location, image_url) VALUES
('Armoire Atelier Principal', 'Armoire contenant les outils de base de l''atelier', 'Atelier - Zone A', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800'),
('Armoire Électrique', 'Outils électriques et accessoires', 'Atelier - Zone B', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800'),
('Armoire Mesure et Précision', 'Instruments de mesure et outils de précision', 'Bureau Technique', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800');

-- Insertion d'outils pour l'Armoire Atelier Principal (cabinet_id = 1)
INSERT INTO tools (cabinet_id, name, description, quantity, image_url, position_x, position_y, position_width, position_height) VALUES
(1, 'Marteau', 'Marteau de charpentier 500g', 2, 'https://images.unsplash.com/photo-1586864387634-700e5a0c6bcd?w=400', 0.1, 0.2, 0.15, 0.1),
(1, 'Tournevis cruciforme', 'Set de 3 tournevis cruciformes', 3, 'https://images.unsplash.com/photo-1571806973780-17b9a554f0d9?w=400', 0.3, 0.2, 0.12, 0.1),
(1, 'Tournevis plat', 'Set de 3 tournevis plats', 3, 'https://images.unsplash.com/photo-1571806973780-17b9a554f0d9?w=400', 0.45, 0.2, 0.12, 0.1),
(1, 'Clé anglaise', 'Clé anglaise ajustable 250mm', 2, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400', 0.6, 0.2, 0.15, 0.12),
(1, 'Pince multiprise', 'Pince multiprise 250mm', 2, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', 0.1, 0.4, 0.12, 0.1),
(1, 'Niveau à bulle', 'Niveau à bulle 600mm', 1, 'https://images.unsplash.com/photo-1581092583537-20d51876c463?w=400', 0.3, 0.4, 0.2, 0.08),
(1, 'Mètre ruban', 'Mètre ruban 5m', 2, 'https://images.unsplash.com/photo-1625135761648-907348eee7f5?w=400', 0.55, 0.4, 0.1, 0.1),
(1, 'Scie à main', 'Scie à main universelle', 1, 'https://images.unsplash.com/photo-1599009434879-2837296e1e75?w=400', 0.1, 0.6, 0.25, 0.12);

-- Insertion d'outils pour l'Armoire Électrique (cabinet_id = 2)
INSERT INTO tools (cabinet_id, name, description, quantity, image_url, position_x, position_y, position_width, position_height) VALUES
(2, 'Perceuse sans fil', 'Perceuse visseuse 18V', 1, 'https://images.unsplash.com/photo-1613486894310-e1dd71a43eac?w=400', 0.1, 0.2, 0.2, 0.15),
(2, 'Meuleuse d''angle', 'Meuleuse d''angle 125mm', 1, 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400', 0.35, 0.2, 0.2, 0.15),
(2, 'Scie sauteuse', 'Scie sauteuse électrique 550W', 1, 'https://images.unsplash.com/photo-1599009434879-2837296e1e75?w=400', 0.6, 0.2, 0.18, 0.15),
(2, 'Ponceuse orbitale', 'Ponceuse excentrique 300W', 1, 'https://images.unsplash.com/photo-1581092583537-20d51876c463?w=400', 0.1, 0.45, 0.18, 0.12),
(2, 'Chargeur batterie 18V', 'Chargeur pour batteries 18V', 2, 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?w=400', 0.35, 0.45, 0.15, 0.1),
(2, 'Batterie 18V', 'Batterie lithium-ion 18V 4Ah', 3, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', 0.55, 0.45, 0.12, 0.1),
(2, 'Set de forets', 'Set de forets métal/bois 13 pièces', 1, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', 0.1, 0.65, 0.15, 0.08);

-- Insertion d'outils pour l'Armoire Mesure et Précision (cabinet_id = 3)
INSERT INTO tools (cabinet_id, name, description, quantity, image_url, position_x, position_y, position_width, position_height) VALUES
(3, 'Pied à coulisse digital', 'Pied à coulisse numérique 150mm', 1, 'https://images.unsplash.com/photo-1581092583537-20d51876c463?w=400', 0.15, 0.25, 0.18, 0.08),
(3, 'Micromètre', 'Micromètre externe 0-25mm', 1, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400', 0.4, 0.25, 0.15, 0.08),
(3, 'Équerre de précision', 'Équerre de précision 200mm', 1, 'https://images.unsplash.com/photo-1581092583537-20d51876c463?w=400', 0.6, 0.25, 0.12, 0.15),
(3, 'Jauge de profondeur', 'Jauge de profondeur digitale', 1, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', 0.15, 0.5, 0.12, 0.08),
(3, 'Niveau laser', 'Niveau laser rotatif', 1, 'https://images.unsplash.com/photo-1581092583537-20d51876c463?w=400', 0.35, 0.5, 0.15, 0.12),
(3, 'Rapporteur d''angle', 'Rapporteur d''angle digital', 1, 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=400', 0.55, 0.5, 0.12, 0.1);

-- Insertion de vérifications de test
INSERT INTO checks (cabinet_id, user_id, status, notes, confidence_score) VALUES
(1, 2, 'completed', 'Tous les outils présents', 0.95),
(1, 2, 'completed', 'Marteau manquant', 0.88),
(2, 3, 'completed', 'Vérification après utilisation', 0.92);

-- Insertion d'outils manquants pour la vérification 2
INSERT INTO missing_tools (check_id, tool_id) VALUES
(2, 1); -- Marteau manquant

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Données de test insérées avec succès';
    RAISE NOTICE 'Utilisateurs créés:';
    RAISE NOTICE '  - admin / admin123 (role: admin)';
    RAISE NOTICE '  - user1 / user123 (role: user)';
    RAISE NOTICE '  - user2 / user123 (role: user)';
END $$;
