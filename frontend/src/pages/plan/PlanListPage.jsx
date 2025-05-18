import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/common/navbar";

const PlanListPage = () => {
  const [plans, setPlans] = useState([]);
  const [ongoingPlans, setOngoingPlans] = useState([]);
  const [completedPlans, setCompletedPlans] = useState([]);
  const [myPlans, setMyPlans] = useState([]); // Not completed plans (regardless of updates)
  const [filter, setFilter] = useState('all'); // myPlans, ongoing, completed
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

          const plans = data.filter(plan => plan.completed === false && plan.started === false && plan.started === true);
          const myPlans = data.filter(plan => plan.completed === false && plan.started === false)
          const completed = data.filter(plan => plan.completed === true);
          const ongoing = data.filter(plan => plan.started === true && plan.completed === false);

          setMyPlans(myPlans);
          setCompletedPlans(completed);
          setOngoingPlans(ongoing);

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
        setPlans(myPlans.filter(plan => plan.id !== id));
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
          <div className="d-flex gap-2 mb-4">
            <button onClick={() => setFilter('all')} className={filter === 'all' ? 'btn btn-primary' : 'btn btn-outline-primary'}>
              All Plans
            </button>
            <button
              className={`btn ${filter === 'myPlans' ? 'btn-warning' : 'btn-outline-warning'}`}
              onClick={() => setFilter('myPlans')}
            >
              My Plans
            </button>
            <button
              className={`btn ${filter === 'ongoing' ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setFilter('ongoing')}
            >
              Ongoing Plans
            </button>
            <button
              className={`btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('completed')}
            >
              Completed Plans
            </button>
          </div>

          <button className="btn btn-gradient-primary" onClick={() => navigate('/plans/create')}>
            ➕ New Plan
          </button>
        </div>

        <div className="row">
          {/* Completed Timeline */}
          <div className="col-md-4">
            <h4 className="mb-4 text-secondary">🕒 Timeline</h4>
            <ul className="timeline list-unstyled">

              {/* myplans Timeline */}
              {(filter === 'myPlans' || filter === 'all') && myPlans.map(plan => (
                <li key={plan.id} className="timeline-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="timeline-icon bg-warning text-white rounded-circle me-3 d-flex justify-content-center align-items-center">
                      <i className="bi bi-hourglass-split fs-5"></i>
                    </div>
                    <div
                      className="timeline-content bg-light rounded p-2"
                      onClick={() => navigate(`/plans/view/${plan.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="mb-1 text-warning">{plan.title}</h6>
                      <p className="mb-1 small text-muted">{plan.description}</p>
                      <span className="badge bg-warning-subtle text-dark">My Plans</span>
                    </div>
                  </div>
                </li>
              ))}

              {/* Ongoing Timeline */}
              {(filter === 'ongoing' || filter === 'all') && ongoingPlans.map(plan => (
                <li key={plan.id} className="timeline-item mb-4">
                  <div className="d-flex align-items-start">
                    <div className="timeline-icon bg-info text-white rounded-circle me-3 d-flex justify-content-center align-items-center">
                      <i className="bi bi-hourglass-split fs-5"></i>
                    </div>
                    <div
                      className="timeline-content bg-light rounded p-2"
                      onClick={() => navigate(`/plans/view/${plan.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="mb-1 text-info">{plan.title}</h6>
                      <p className="mb-1 small text-muted">{plan.description}</p>
                      <span className="badge bg-info-subtle text-dark">Ongoing</span>
                    </div>
                  </div>
                </li>
              ))}

              {/* Completed Timeline */}
              {(filter === 'completed' || filter === 'all') && completedPlans.map(plan => (
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

          <div className="col-md-8">
            {filter === 'all' && (
              <>
                {/* My Plans Section */}
                {myPlans.length > 0 && (
                  <>
                    <h4 className="mt-4 text-warning">📑 My Plans</h4>
                    <div className="row">
                      {myPlans.map(plan => (
                        <div key={plan.id} className="col-md-6 mb-4">
                          <div className="card border-0 shadow-sm bg-warning-subtle" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="card-body text-dark">
                              <h5>{plan.title}</h5>
                              <h6 className="text-muted">{plan.skill}</h6>
                              <p>{plan.description}</p>
                              <span className={`badge ${plan.isPublic ? 'bg-info' : 'bg-secondary'}`}>
                                {plan.isPublic ? '🌐 Public' : '🔒 Private'}
                              </span>
                            </div>
                            <div className="card-footer bg-transparent d-flex d-flex justify-content-between">
                              <button className="btn btn-sm btn-light" onClick={(e) => { e.stopPropagation(); navigate(`/plans/edit/${plan.id}`); }}>✏️ Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>🗑️ Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Ongoing Plans Section */}
                {ongoingPlans.length > 0 && (
                  <>
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
                                
                              </div>
                              <div className="card-footer bg-transparent d-flex justify-content-end">
                                {/* <button className="btn btn-sm btn-light" onClick={(e) => { e.stopPropagation(); navigate(`/plans/edit/${plan.id}`); }}>✏️ Edit</button> */}
                                <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(plan.id); }}>🗑️ Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Completed Plans Section */}
                {completedPlans.length > 0 && (
                  <>
                    <h4 className="mt-4 text-success">🏁 Completed Plans</h4>
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
              </>
            )}

            {filter === 'ongoing' && (
              <>
                <h4 className="text-primary mb-3">🚀 Ongoing Plans</h4>
                {ongoingPlans.length === 0 ? (
                  <p className="text-muted">No ongoing plans.</p>
                ) : (
                  <div className="row">
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
                  </div>
                )}
              </>
            )}

            {filter === 'completed' && (
              <>
                <h4 className="mt-4 text-success">✅ Completed Plans</h4>
                {completedPlans.length === 0 ? (
                  <p className="text-muted">No completed plans.</p>
                ) : (
                  <div className="row">
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
                  </div>
                )}
              </>
            )}

            {filter === 'myPlans' && (
              <>
                <h4 className="mt-4 text-warning">📑 My Plans</h4>
                <h6 className="mt-4">You want to start these plans? Just Click the plan and Start the plan.</h6>
                {myPlans.length === 0 ? (
                  <p className="text-muted">No My plans.</p>
                ) : (
                  <div className="row">
                    <div className="row">
                      {myPlans.map(plan => (
                        <div key={plan.id} className="col-md-6 mb-4">
                          <div className="card border-0 shadow-sm bg-warning-subtle" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
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
                  </div>
                )}
              </>
            )}
          </div>






        </div>
      </div>
    </>
  );
};

export default PlanListPage;
