import { Link, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';

const Navbar = () => {
  const navigate = useNavigate();



  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">SkillXchange</Link>
      
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/plan-template">Create Plan</Link>
          </li>
        </ul>

        <button className="btn btn-outline-light">
            <Link className="nav-link" to="/login">Login</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
