// pages/auth/SignupPage.jsx
import useAuth from '../../hooks/useAuth';
import SignupForm from '../../components/auth/signupForm';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

const SignupPage = () => {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (username, email, password) => {
    const response = await signup(username, email, password);
    if (response) {
      navigate('/login');
    }
  };

  return (
    <>
    <Navbar />
      <div>
        <h2 className="text-2xl font-bold text-center mt-5 text-gray-800">
          Welcome to SkillXchange 🎉
        </h2>
        <div className="card position-absolute start-50 translate-middle-x mt-5">
          <div className="card-body">
            
            <h3 classname="card-title text-2xl font-bold text-gray-800">
              SIGNUP
            </h3>

            <div className="card-text text-sm text-gray-600 mt-4">
              <SignupForm
                onSubmit={handleSignup}
                loading={loading}
                error={error}
              />
            </div>

            <div className="btn">
              <GoogleLoginButton />
            </div>

            <p className="card-text text-sm text-center mt-3 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
  
};

export default SignupPage;
