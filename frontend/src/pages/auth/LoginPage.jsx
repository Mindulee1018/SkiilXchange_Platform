// src/pages/auth/LoginPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoginForm from "../../components/auth/LoginForm";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard"); // Redirect to dashboard if token exists
  }, [navigate]);

  const handleLogin = async (email, password) => {
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard"); // redirect after login
    }
  };

  return (
    <>
      <Navbar />

      <div>
        <h2 className="text-2xl font-bold text-center mt-5 mb-6 text-gray-800">
          Welcome Back 👋
        </h2>
        <div className="card position-absolute start-50 translate-middle-x mt-5">
          <div className="card-body">
            <h3 classname="card-title text-2xl font-bold text-gray-800">
              LOGIN
            </h3>

            <div className="card-text text-sm text-gray-600 mt-4">
              <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
              />
            </div>

            <div className="btn">
              <GoogleLoginButton />
            </div>

            <p className="card-text text-sm text-center mt-3 text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
