// pages/auth/SignupPage.jsx
import useAuth from '../../hooks/useAuth';
import SignupForm from '../../components/auth/signupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (username, email, password) => {
    const response = await signup(username, email, password);
    if (response) {
      navigate('/login');
    }
  };

  return <SignupForm onSubmit={handleSignup} loading={loading} error={error} />;
};

export default SignupPage;
