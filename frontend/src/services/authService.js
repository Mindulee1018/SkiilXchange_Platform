// services/authService.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';

const login = async (email, password) => {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  return res.data;
};

const signup = async (username, email, password) => {
  const res = await axios.post(`${API_BASE}/signup`, { username, email, password });
  return res.data;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

const logout = () => {
  localStorage.removeItem('token');
};

const getProfile = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const response = await fetch("http://localhost:8080/api/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data; // includes username, email, id, etc.
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
};

export default { login, signup, isAuthenticated, logout, getProfile, getCurrentUser };
