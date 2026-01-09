/**
 * Contexte d'authentification React
 * Fournit l'état d'authentification à toute l'application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (isAuthenticated && currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Fonction de connexion
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(username, password);
      setUser(response.user);

      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Fonction d'inscription
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);

      await authService.register(username, email, password);

      // Auto-login après inscription
      const loginResult = await login(username, password);
      return loginResult;
    } catch (err) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur est admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Rafraîchir les données utilisateur
  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isAdmin,
    isAuthenticated: !!user,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
