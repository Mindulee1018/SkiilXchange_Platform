// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Dashboard from "./pages/auth/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OAuth2Success from "./pages/auth/OAuth2Success";
import PlanTemplate from "./pages/auth/PlanTemplate";
import ProfilePage from "./pages/auth/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth2-success" element={<OAuth2Success />} />
        <Route path="/plan-template" element={<PlanTemplate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
