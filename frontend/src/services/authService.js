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

export default { login, signup };
