# Backend Dockerfile pour ArmoireCheck

FROM node:18-alpine

# Installer PostgreSQL client pour les scripts de migration
RUN apk add --no-cache postgresql-client

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Créer le dossier logs
RUN mkdir -p logs

# Exposer le port
EXPOSE 5001

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/status', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer l'application
CMD ["npm", "start"]
