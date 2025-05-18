// src/pages/Dashboard.jsx
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import { useEffect, useState } from 'react';
import authService from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [publicPlans, setPublicPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usernames, setUsernames] = useState({});

   useEffect(() => {
  const fetchPublicPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('http://localhost:8080/api/learning-plans/public', { headers });
      if (res.ok) {
        const data = await res.json();
        setPublicPlans(data);
      } else {
        console.error('Failed to load public plans');
      }
    } catch (err) {
      console.error('Failed to fetch public plans', err);
    } finally {
      setLoading(false); // 🔥 Ensure loading is turned off
    }
  };

  fetchPublicPlans();
}, []);


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return; // Don't fetch usernames if not logged in

  const userIdsToFetch = publicPlans
    .map(plan => plan.userId)
    .filter((id, i, arr) => id && !usernames[id] && arr.indexOf(id) === i); // unique & not fetched

  if (userIdsToFetch.length === 0) return;

  const fetchAllUsernames = async () => {
    try {
      const updates = {};
      await Promise.all(
        userIdsToFetch.map(async (userId) => {
          const res = await fetch(`http://localhost:8080/api/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            updates[userId] = data.username;
          }
        })
      );
      setUsernames(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error("Error fetching usernames in batch", err);
    }
  };

  fetchAllUsernames();
}, [publicPlans]);


  return (
    <>
      <Navbar />
      <header className="bg-primary text-white text-center py-5 shadow-sm">
        <h1 className="display-4">Welcome to SkillXchange</h1>
        <p className="lead">Elevate your skills with personalized learning plans</p>
        <Link to="/plans/create" className="btn btn-light btn-lg mt-3">
          + Create Your Own Plan
        </Link>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4">Explore Top Skill Learning Plans</h2>
        <div className="row g-4">
          {[
            {
              title: "Python for Beginners",
              desc: "Start coding in Python with fun projects and clear guidance.",
              img: "data:image/png;base64,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",
            },
            {
              title: "Web Development",
              desc: "Master HTML, CSS, and JS to build responsive websites.",
              img: "https://t3.ftcdn.net/jpg/02/14/87/96/360_F_214879686_R3HFJlk6WLr1kcdvy6Q9rtNASKN0BZBS.jpg",
            },
            {
              title: "Data Science Essentials",
              desc: "Analyze data and explore AI using Python and real-world datasets.",
              img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQeFNEU9rMn-NP0FAULbsQvWl0-NaH2qbLoy9tS3OgPMiJB_YD8tfEXB542hNz2g_CJm4&usqp=CAU",
            },
          ].map((course, i) => (
            <div key={i} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={course.img}
                  className="card-img-top"
                  alt={course.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.desc}</p>
                  <button className="btn btn-outline-primary mt-auto">Start</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Public Plans Section */}
      <section className="bg-light py-5">
        <div className="container">
          <h3 className="mb-4 text-center">Browse All Public Plans</h3>
          {loading ? (
            <p>Loading public plans...</p>
          ) : publicPlans.length === 0 ? (
            <p>No public plans found.</p>
          ) : (
            <div className="row">
              {publicPlans.slice(0, 6).map((plan) => (
                <div key={plan.id} className="col-md-6 mb-4">
                  <div
                  className="card h-100 border-0 shadow-sm plan-card"
                  onClick={() => navigate(`/plans/view/${plan.id}`)}
                  style={{ cursor: 'pointer', transition: '0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.classList.add('shadow-lg')}
                  onMouseLeave={e => e.currentTarget.classList.remove('shadow-lg')}
                >
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{plan.title}</h5>
                      <h6 className="card-subtitle mb-2 text-primary">{plan.skill}</h6>
                      <p className="card-text text-muted">{plan.description}</p>
                      <div className="text-muted small">
                        {plan.tags?.map((tag, i) => {
                          const customColors = [
                            '#6f42c1', // purple
                            '#20c997', // teal
                            '#fd7e14', // orange
                            '#0dcaf0', // cyan
                            '#d63384', // pink
                            '#ffc107', // yellow
                            '#198754', // green
                            '#0d6efd'  // blue
                          ];
                          const bgColor = customColors[i % customColors.length];

                          return (
                            <span
                              key={i}
                              className="badge me-1"
                              onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/search?tag=${tag}`);
                            }}
                              style={{
                                cursor: 'pointer',
                                backgroundColor: bgColor,
                                color: 'white',
                                padding: '0.5em 0.75em',
                                fontSize: '0.80rem'
                              }}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-muted small">
                      By:{' '}
                      <span
                        className="text-primary"
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${plan.userId}`);
                        }}
                      >
                        {usernames[plan.userId] || 'Loading...'}
                      </span>
                    </div>
                    <div className="text-muted small">
                      🗓️ Created on: {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center mt-3">
                  <Link to="/plans/public" className="btn btn-outline-primary">
                    View All Public Plans
                  </Link>
                </div>
            </div>
          )}
        </div>
      </section>

      <section className="bg-light py-5 mt-5">
        <div className="container text-center">
          <h2>Track Your Learning Progress</h2>
          <p className="mb-4">Visualize your growth and achievements in real-time.</p>
          <Link to="/plans" className="btn btn-success btn-lg">
            📊 View My Plans
          </Link>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
