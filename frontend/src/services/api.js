/**
 * Service API centralisé pour les appels au backend
 * Gère l'authentification, les requêtes HTTP et la gestion des erreurs
 */

import axios from 'axios';

// Configuration de l'URL de base de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Création d'une instance axios configurée
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // Erreur avec réponse du serveur
      const { status, data } = error.response;

      // Déconnexion automatique si token expiré
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Retourner un objet d'erreur structuré
      return Promise.reject({
        status,
        message: data.message || 'An error occurred',
        data: data
      });
    } else if (error.request) {
      // Erreur sans réponse du serveur
      return Promise.reject({
        status: 0,
        message: 'Network error - server is unreachable',
        data: null
      });
    } else {
      // Erreur lors de la configuration de la requête
      return Promise.reject({
        status: -1,
        message: error.message || 'Request configuration error',
        data: null
      });
    }
  }
);

// Service d'authentification
export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/login', { username, password });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  register: async (username, email, password) => {
    return await apiClient.post('/users', { username, email, password, role: 'user' });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

// Service pour les armoires
export const cabinetService = {
  getAll: async () => {
    return await apiClient.get('/cabinets');
  },

  getById: async (id) => {
    return await apiClient.get(`/cabinets/${id}`);
  },

  create: async (cabinet) => {
    return await apiClient.post('/cabinets', cabinet);
  },

  update: async (id, cabinet) => {
    return await apiClient.put(`/cabinets/${id}`, cabinet);
  },

  delete: async (id) => {
    return await apiClient.delete(`/cabinets/${id}`);
  },

  getTools: async (cabinetId) => {
    return await apiClient.get(`/cabinets/${cabinetId}/tools`);
  },

  getChecks: async (cabinetId) => {
    return await apiClient.get(`/cabinets/${cabinetId}/checks`);
  }
};

// Service pour les outils
export const toolService = {
  getAll: async () => {
    return await apiClient.get('/tools');
  },

  getById: async (id) => {
    return await apiClient.get(`/tools/${id}`);
  },

  create: async (tool) => {
    return await apiClient.post('/tools', tool);
  },

  update: async (id, tool) => {
    return await apiClient.put(`/tools/${id}`, tool);
  },

  delete: async (id) => {
    return await apiClient.delete(`/tools/${id}`);
  }
};

// Service pour les vérifications
export const checkService = {
  create: async (check) => {
    return await apiClient.post('/checks', check);
  },

  getById: async (id) => {
    return await apiClient.get(`/checks/${id}`);
  }
};

// Service pour les utilisateurs (admin uniquement)
export const userService = {
  getAll: async () => {
    return await apiClient.get('/users');
  },

  getById: async (id) => {
    return await apiClient.get(`/users/${id}`);
  },

  create: async (user) => {
    return await apiClient.post('/users', user);
  },

  update: async (id, user) => {
    return await apiClient.put(`/users/${id}`, user);
  },

  delete: async (id) => {
    return await apiClient.delete(`/users/${id}`);
  }
};

// Service de santé de l'API
export const healthService = {
  checkStatus: async () => {
    return await apiClient.get('/status');
  }
};

// Export par défaut de l'instance axios pour des cas d'usage avancés
export default apiClient;
