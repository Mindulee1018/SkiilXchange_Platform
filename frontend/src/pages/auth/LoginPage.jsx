// src/pages/auth/LoginPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard'); // Redirect to dashboard if token exists
  }, [navigate]);

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard'); // redirect after login
    }
  };

  return (
    <div>
      <GoogleLoginButton />
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </div>
  );
};

export default LoginPage;
