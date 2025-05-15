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
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Your Learning Plans</h2>
          <button className="btn btn-success" onClick={() => navigate('/plans/create')}>
            + New Plan
          </button>
        </div>

        <div className="container mt-5">
          <div className="row">
            {/* Left Side: Completed Plans Timeline */}
            <div className="col-md-4">
              <h4 className="mb-4">📌 Completed Timeline</h4>
              <ul className="timeline">
                {completedPlans.map((plan, index) => (
                  <li key={plan.id} className="timeline-item">
                    <div className="timeline-icon bg-success text-white">
                      ✓
                    </div>
                    <div className="timeline-content" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                      <h5>{plan.title}</h5>
                      <p>{plan.description}</p>
                      <small>Completed on {new Date(plan.createdAt).toLocaleDateString()}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Ongoing and Completed Cards */}
            <div className="col-md-8">
              {/* Ongoing Plans */}
              <h3>Ongoing Plans</h3>
              {ongoingPlans.length === 0 ? (
                <p>No plans yet. Click “New Plan” to get started.</p>
              ) : (
                <div className="row">
                  {ongoingPlans.map(plan => (
                    <div key={plan.id} className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="card-body">
                          <h5 className="card-title">{plan.title}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                          <p className="card-text">{plan.description}</p>
                          <div className="text-muted small">
                            {plan.isPublic ? '🌐 Public' : '🔒 Private'} • Created: {new Date(plan.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                          <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); navigate(`/plans/edit/${plan.id}`); }}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Plans (Card view) */}
              {completedPlans.length > 0 && (
                <>
                  <h3 className="mt-4">Completed Plans (Card View)</h3>
                  <div className="row">
                    {completedPlans.map(plan => (
                      <div key={plan.id} className="col-md-6 mb-4">
                        <div className="card h-100 shadow-sm" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                          <div className="card-body">
                            <h5 className="card-title">{plan.title}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                            <p className="card-text">{plan.description}</p>
                            <div className="text-muted small">
                              {plan.isPublic ? '🌐 Public' : '🔒 Private'} • Created: {new Date(plan.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="card-footer d-flex justify-content-end">
                            <button className="btn btn-sm btn-outline-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>Delete</button>
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








      </div>
    </>
  );
};

export default PlanListPage;
