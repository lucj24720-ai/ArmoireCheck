# Frontend Dockerfile pour ArmoireCheck

# Stage 1: Build
FROM node:18-alpine as build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci && npm cache clean --force

# Copier le code source
COPY . .

# Arguments de build pour les variables d'environnement
ARG REACT_APP_API_URL
ARG REACT_APP_CLERK_PUBLISHABLE_KEY

# Définir les variables d'environnement
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_CLERK_PUBLISHABLE_KEY=$REACT_APP_CLERK_PUBLISHABLE_KEY

# Build de l'application
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine

# Copier le build depuis le stage précédent
COPY --from=build /app/build /usr/share/nginx/html

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
