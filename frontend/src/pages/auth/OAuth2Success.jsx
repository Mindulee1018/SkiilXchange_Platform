// pages/auth/OAuth2Success.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      console.log('Storing token:', token);  // Log to verify token
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
};

export default OAuth2Success;
