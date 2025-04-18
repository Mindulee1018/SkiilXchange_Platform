// src/pages/Dashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [learningPeriod, setLearningPeriod] = useState(1);
  const [customRange, setCustomRange] = useState(false);
  const [maxWeeks, setMaxWeeks] = useState(1);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleLearningPeriodChange = (e) => {
    const value = e.target.value;
    setLearningPeriod(value);
    setCustomRange(value === 'Custom');
    setMaxWeeks(value !== 'Custom' ? parseInt(value) : 0);
    setTasks([]); // Reset tasks when learning period changes
  };

  const handleAddTask = () => {
    if (maxWeeks && tasks.length >= maxWeeks) {
      alert('You can only add tasks up to the selected learning period!');
      return;
    }

    setTasks([...tasks, { id: tasks.length + 1, taskTitle: '', instructions: '', file: '' }]);
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleTaskChange = (id, field, value) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, [field]: value } : task)));
  };

  return (
    <>
      <header className="bg-light text-center py-5">
        <h1>Welcome to SkillXchange</h1>
        <p>Enhance your skills with our expert-guided courses</p>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
      </header>

      <section id="courses" className="container py-5">
        <a href="#" className="btn btn-primary">CREATE YOUR OWN PLAN</a>
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

      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2025 SkillXchange. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Dashboard;
