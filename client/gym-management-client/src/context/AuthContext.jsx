import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeLocalStorage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = safeLocalStorage.get('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      safeLocalStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, userData, callback) => {
    localStorage.setItem('token', token);
    safeLocalStorage.set('user', userData);
    setIsAuthenticated(true);
    setUser(userData);
    if (callback) callback();
  };

  const logout = () => {
    localStorage.removeItem('token');
    safeLocalStorage.remove('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};