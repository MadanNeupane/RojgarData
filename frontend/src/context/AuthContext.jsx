import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null: loading

  useEffect(() => {
    authenticate();
  }, []);

  const getToken = (key) => localStorage.getItem(key);

  const refreshToken = async () => {
    try {
      const refresh = getToken(REFRESH_TOKEN);
      const { data, status } = await api.post('/accounts/jwt/refresh/', { refresh });

      if (status === 200) {
        localStorage.setItem(ACCESS_TOKEN, data.access);
        const decoded = jwtDecode(data.access);
        setUser(decoded);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Token refresh error:', err);
      setIsAuthenticated(false);
    }
  };

  const authenticate = async () => {
    const token = getToken(ACCESS_TOKEN);
    if (!token) return setIsAuthenticated(false);

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      decoded.exp < now ? await refreshToken() : (setUser(decoded), setIsAuthenticated(true));
    } catch (err) {
      console.error('Auth error:', err);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
