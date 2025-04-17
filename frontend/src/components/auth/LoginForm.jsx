// components/auth/LoginForm.jsx
import { useState } from 'react';
import {useAuth} from '../../hooks/useAuth';

const LoginForm = () => {
  const { login, loading, error } = useAuth();  // Use the hook
  
  const handleSubmit = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      // Redirect to dashboard or home page on success
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(email, password); }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
};

export default LoginForm;
