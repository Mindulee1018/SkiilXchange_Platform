// pages/auth/LoginPage.jsx
import useAuth from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
}, []);

const LoginPage = () => {
  <GoogleLoginButton />
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // redirect after login
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} error={error} />;
};

export default LoginPage;
