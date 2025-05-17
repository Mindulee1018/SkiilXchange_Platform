import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/common/navbar";

const PlanListPage = () => {
  const [plans, setPlans] = useState([]);
  const [ongoingPlans, setOngoingPlans] = useState([]);
  const [completedPlans, setCompletedPlans] = useState([]);
  const [updateCounts, setUpdateCounts] = useState({}); // planId => count

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

          const ongoing = data.filter(plan => plan.completed === false);
          const completed = data.filter(plan => plan.completed === true);

          setOngoingPlans(ongoing);
          setCompletedPlans(completed);

          // Fetch updates for all ongoing plans
          await fetchProgressUpdateCounts(ongoing.map(p => p.id));
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

  const fetchProgressUpdateCounts = async (planIds) => {
    try {
      const token = localStorage.getItem('token');
      const counts = {};

      for (const planId of planIds) {
        const res = await fetch(`http://localhost:8080/api/progress-updates/by-plan/${planId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const updates = await res.json();
          counts[planId] = updates.length;
        } else {
          counts[planId] = 0;
        }
      }

      setUpdateCounts(counts);
    } catch (err) {
      console.error('Failed to fetch update counts', err);
    }
  };

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
        setOngoingPlans(ongoingPlans.filter(plan => plan.id !== id));
        setCompletedPlans(completedPlans.filter(plan => plan.id !== id));
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
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="container mt-5 pt-5">
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <h2 className="text-primary">🎯 Your Learning Plans</h2>
          <button className="btn btn-gradient-primary" onClick={() => navigate('/plans/create')}>
            ➕ New Plan
          </button>
        </div>

        <div className="row">
          {/* Completed Timeline */}
          <div className="col-md-4">
            <h4 className="mb-4 text-success">✅ Completed Timeline</h4>
            <ul className="timeline list-unstyled">
              {completedPlans.map(plan => (
                <li key={plan.id} className="timeline-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="timeline-icon bg-success text-white rounded-circle me-3 d-flex justify-content-center align-items-center">
                      <i className="bi bi-check2-circle fs-5"></i>
                    </div>
                    <div
                      className="timeline-content bg-light rounded p-2"
                      onClick={() => navigate(`/plans/view/${plan.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="mb-1 text-success">{plan.title}</h6>
                      <p className="mb-1 small text-muted">{plan.description}</p>
                      <span className="badge bg-success-subtle text-dark">Completed</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Ongoing + Completed Cards */}
          <div className="col-md-8">
            <h4 className="text-primary mb-3">🚀 Ongoing Plans</h4>
            {ongoingPlans.length === 0 ? (
              <p className="text-muted">No plans yet. Click “New Plan” to get started.</p>
            ) : (
              <div className="row">
                {ongoingPlans.map(plan => (
                  <div key={plan.id} className="col-md-6 mb-4">
                    <div className="card border-0 shadow-sm bg-primary-subtle" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                      <div className="card-body text-dark">
                        <h5>{plan.title}</h5>
                        <h6 className="text-muted">{plan.skill}</h6>
                        <p>{plan.description}</p>
                        <span className={`badge ${plan.isPublic ? 'bg-info' : 'bg-secondary'}`}>
                          {plan.isPublic ? '🌐 Public' : '🔒 Private'}
                        </span>{' '}
                        <span className="badge bg-warning text-dark">{updateCounts[plan.id] || 0} Updates</span>
                      </div>
                      <div className="card-footer bg-transparent d-flex justify-content-between">
                        <button className="btn btn-sm btn-light" onClick={(e) => { e.stopPropagation(); navigate(`/plans/edit/${plan.id}`); }}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Plans in Card View */}
            {completedPlans.length > 0 && (
              <>
                <h4 className="mt-4 text-success">🏁 Completed Plans (Cards)</h4>
                <div className="row">
                  {completedPlans.map(plan => (
                    <div key={plan.id} className="col-md-6 mb-4">
                      <div className="card border-0 shadow-sm bg-success-subtle" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="card-body text-dark">
                          <h5>{plan.title}</h5>
                          <h6 className="text-muted">{plan.skill}</h6>
                          <p>{plan.description}</p>
                          <span className={`badge ${plan.isPublic ? 'bg-info' : 'bg-secondary'}`}>
                            {plan.isPublic ? '🌐 Public' : '🔒 Private'}
                          </span>
                        </div>
                        <div className="card-footer bg-transparent d-flex justify-content-end">
                          <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanListPage;
