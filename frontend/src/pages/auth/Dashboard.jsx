// src/pages/Dashboard.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import footerSection from '../../components/footer';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };



  return (
    <>
      <Navbar />
      <header className="bg-light text-center py-5">
        <h1>Welcome to SkillXchange</h1>
        <p>Enhance your skills with our expert-guided courses</p>
      </header>

      <section id="courses" className="container py-5">
        <Link to="/plan-template" className="btn btn-primary">CREATE YOUR OWN PLAN</Link>

        <h2 className="text-center">Explore Skill Plans</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/350" className="card-img-top" alt="Course" />
              <div className="card-body">
                <h5 className="card-title">Python for Beginners</h5>
                <p className="card-text">Learn Python from scratch with hands-on projects.</p>
                <a href="#" className="btn btn-primary">Enroll Now</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/350" className="card-img-top" alt="Course" />
              <div className="card-body">
                <h5 className="card-title">Web Development</h5>
                <p className="card-text">Master HTML, CSS, and JavaScript to build amazing websites.</p>
                <a href="#" className="btn btn-primary">Enroll Now</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <img src="https://via.placeholder.com/350" className="card-img-top" alt="Course" />
              <div className="card-body">
                <h5 className="card-title">Data Science</h5>
                <p className="card-text">Explore data analysis, machine learning, and AI applications.</p>
                <a href="#" className="btn btn-primary">Enroll Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="progress" className="bg-light py-5">
        <div className="container text-center">
          <h2>Track Your Progress</h2>
          <p>Monitor your learning journey with our progress tracker.</p>
          <button className="btn btn-success">View Dashboard</button>
        </div>
      </section>

      <footerSection/>
    </>
  );
};

export default Dashboard;
