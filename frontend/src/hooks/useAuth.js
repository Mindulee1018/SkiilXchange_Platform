// hooks/useAuth.js
import { useState } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.token);
      setError('');
      return true;
    } catch (err) {
      setError(err.response?.data || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await authService.signup(username, email, password);
      setError('');
      return res;
    } catch (err) {
      setError(err.response?.data || 'Signup failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error };
};

export default useAuth;
