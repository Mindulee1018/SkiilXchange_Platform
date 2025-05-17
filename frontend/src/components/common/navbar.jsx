import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


const Navbar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8080/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);




  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">
        SkillXchange
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/plans/create">
              Create Plan
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/plans/public">
              Browse Plans
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/mypost">
              Your Posts
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/foryou">
              For You
            </Link>
          </li>
        </ul>

        {profile ? (
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
              <img
                src={profile.profilePicture || "https://via.placeholder.com/40"}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span className="ms-2 text-white">{profile.username}</span>
            </div>
            <button className="btn btn-sm btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <Link className="btn btn-outline-light" to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
