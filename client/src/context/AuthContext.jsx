import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check current session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.data?.user) {
            setUser(res.data.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.data.user));
          }
        } catch (err) {
          console.warn('[AuthContext] Session expired or server unavailable:', err.message);
          // If 401, clear stored auth
          if (err.message.includes('401') || err.message.includes('expired')) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const clearError = () => setError(null);

  // Register user (FR-1)
  const register = async ({ name, email, password, confirmPassword }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword,
      });

      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setLoading(false);
      return { success: true, user: receivedUser };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Login user (FR-2)
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      setLoading(false);
      return { success: true, user: receivedUser };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Logout user (FR-2.4)
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Quick Demo Login helper for instantaneous viva / evaluation testing
  const loginDemo = async () => {
    const demoEmail = 'student@pathpilot.edu';
    const demoPassword = 'Password123!';
    
    // First try normal login
    const loginRes = await login({ email: demoEmail, password: demoPassword });
    if (loginRes.success) return loginRes;

    // If not yet registered, register automatically
    const regRes = await register({
      name: 'Naga Lakshmi (Student Demo)',
      email: demoEmail,
      password: demoPassword,
      confirmPassword: demoPassword,
    });
    return regRes;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        loginDemo,
        logout,
        clearError,
        isAuthenticated: !!token && !!user,
      }}
    >
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

export default AuthContext;
