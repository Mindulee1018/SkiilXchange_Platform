// src/pages/auth/PlanViewPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';
import WebSocketNotifications from '../../components/WebSocketNotifications';

const PlanViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const completedTasks = plan.tasks.filter(task => task.completed).length;
  const totalTasks = plan.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;


  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setPlan(data);
        } else {
          setError('Plan not found');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading plan');
      }
    };

    fetchPlan();
  }, [id]);

  const handleStartPlan = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`http://localhost:8080/api/learning-plans/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        setStarted(true);

        // Refresh plan
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updated.ok) {
          const data = await updated.json();
          setPlan(data);
        }

        // Send WebSocket notification
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
          window.socket.send(JSON.stringify({
            type: 'PLAN_STARTED',
            planId: id,
            title: plan.title,
            message: `You have started the plan: ${plan.title}`
          }));
        }

        // Save to ProgressUpdate table
        await fetch(`http://localhost:8080/api/ProgressUpdate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            learningPlanId: id,
            message: `Plan "${plan.title}" has been started.`,
            type: 'STARTED'
          })
        });
      } else {
        console.error('Failed to start plan');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTaskCompletion = async (taskIndex) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/learning-plans/${id}/tasks/${taskIndex}/complete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (res.ok) {
        // Re-fetch the full updated plan
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updated.ok) {
          const data = await updated.json();
          setPlan(data);
        }
      } else {
        console.error('Failed to mark task complete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkTaskIncomplete = async (taskIndex) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/learning-plans/${id}/tasks/${taskIndex}/incomplete`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (res.ok) {
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (updated.ok) {
          const data = await updated.json();
          setPlan(data);
        }
      } else {
        console.error('Failed to mark task incomplete');
      }
    } catch (err) {
      console.error(err);
    }
  };


  const handleDeletePlan = async () => {
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
        navigate('/plans');
      } else {
        console.error('Failed to delete plan');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!plan) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{plan.title}</h2>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/plans/edit/${id}`)}>Edit</button>
            <button className="btn btn-outline-danger" onClick={handleDeletePlan}>Delete</button>
          </div>
        </div>

        <p className="text-muted">Skill: {plan.skill}</p>
        <p>{plan.description}</p>
        <div className="mb-3">
          {plan.tags?.map((tag, i) => (
            <span key={i} className="badge bg-secondary me-1">{tag}</span>
          ))}
        </div>
        <p><strong>Learning Period:</strong> {plan.learningPeriodInDays} days</p>
        <p><strong>Visibility:</strong> {plan.isPublic ? '🌐 Public' : '🔒 Private'}</p>
        
        {!started && (
          <button className="btn btn-success my-3" onClick={handleStartPlan}>
            Start Plan
          </button>
        )}

        {started && (
          <>
           <div className="progress my-3">
            <div
              className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style={{ width: `${progressPercent}%` }}
            >
              {progressPercent.toFixed(0)}%
            </div>
          </div>

          <p className="text-muted text-center">
            {completedTasks} of {totalTasks} tasks completed
          </p>
          </>

          
        )}

        <hr />

        <h4>Tasks</h4>
        {plan.tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          <ul className="list-group">
            {plan.tasks.map((task, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                        if (task.completed) {
                          handleMarkTaskIncomplete(i);
                        } else {
                          handleToggleTaskCompletion(i);
                      }}}
                  />
                  <label className="form-check-label">
                    <strong>{task.title}</strong><br />
                    <small>{task.description}</small><br />
                    <small className="text-muted">
                      Due: {task.dueDate?.slice(0, 10)} | Duration: {task.durationInDays} days
                    </small>
                  </label>
                </div>
                <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>{task.completed ? 'Completed' : 'Pending'}</span>
              </li>
            ))}
          </ul>
        )}
        <WebSocketNotifications />
      </div>
    </>
  );
};

export default PlanViewPage;
