import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const CompletedPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedPlans = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/learning-plans/completed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      } else {
        console.error('Failed to fetch completed plans');
      }
    };

    fetchCompletedPlans();
  }, []);

  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="container mt-5">
        <h2>Completed Plans</h2>
        {plans.length === 0 ? (
          <p>No completed plans yet.</p>
        ) : (
          <ul className="list-group">
            {plans.map((plan) => (
              <li
                key={plan._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{plan.title}</span>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate(`/plans/view/${plan._id}`)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default CompletedPlansPage;
