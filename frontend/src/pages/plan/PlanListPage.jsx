// pages/PlanListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from "../../components/common/navbar";

const PlanListPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/learning-plans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        } else {
          console.error('Failed to load plans');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setPlans(plans.filter(plan => plan.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container mt-5">Loading plans...</div>;

  return (
    <>
        <Navbar />
        <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Your Learning Plans</h2>
            <button className="btn btn-success" onClick={() => navigate('/plans/create')}>
            + New Plan
            </button>
        </div>

        {plans.length === 0 ? (
            <p>No plans yet. Click “New Plan” to get started.</p>
        ) : (
            <div className="row">
            {plans.map(plan => (
                <div key={plan.id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="card-body">
                    <h5 className="card-title">{plan.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                    <p className="card-text">{plan.description}</p>
                    <div className="mb-2">
                        {plan.tags?.map((tag, i) => (
                        <span key={i} className="badge bg-secondary me-1">{tag}</span>
                        ))}
                    </div>
                    {plan.tags?.map((tag, i) => (
                      <span
                      className="badge bg-secondary me-1"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/search?tag=${encodeURIComponent(tag)}`);
                      }}
                    >
                      {tag}
                    </span>
                    ))}
                  </div>
                    <div className="text-muted small">
                        {plan.isPublic ? '🌐 Public' : '🔒 Private'} • Created: {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                    </div>
                    <div className="card-footer d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary" onClick={(e) => {e.stopPropagation(); navigate(`/plans/edit/${plan.id}`);}}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={(e) => {e.stopPropagation(); handleDelete(plan.id);}}>Delete</button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    </>
  );
};

export default PlanListPage;