import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Decode basic user info from token payload
    const payload = JSON.parse(atob(data.access.split('.')[1]));
    const userObj = {
      id: payload.user_id,
      username: payload.username || credentials.username,
    };
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
    toast.success(`Welcome back, ${userObj.username}!`);
    return userObj;
  }, []);

  const register = useCallback(async (userData) => {
    await registerUser(userData);
    toast.success('Account created! Please log in.');
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
