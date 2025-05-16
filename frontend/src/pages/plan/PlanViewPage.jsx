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

  const completedTasks = plan?.tasks?.filter(task => task.completed).length || 0;
  const totalTasks = plan?.tasks?.length || 0;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleViewProgress = () => {
    navigate(`/plans/progress/${plan.id}`); // Redirect to ProgressPage with plan ID
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
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
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setStarted(true);

        // Refresh plan
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (updated.ok) {
          const data = await updated.json();
          setPlan(data);
        }

        // Save to ProgressUpdate
        await fetch(`http://localhost:8080/api/ProgressUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            learningPlanId: id,
            message: `Plan "${plan.title}" has been started.`,
            type: 'STARTED',
          }),
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (updated.ok) {
          const data = await updated.json();
          setPlan(data);

          const task = data.tasks[taskIndex];

          // Send progress update
          await fetch(`http://localhost:8080/api/ProgressUpdate`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              learningPlanId: id,
              message: `Task "${task.title}" in plan "${data.title}" has been completed.`,
              type: 'UPDATE',
            }),
          });
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const updated = await fetch(`http://localhost:8080/api/learning-plans/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
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
        headers: { Authorization: `Bearer ${token}` },
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

  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!plan) return <div className="container mt-5">Loading...</div>;

  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center">

          <h2 className="pt-5">
            {plan.title}
            {plan.completed && <span className="badge bg-success ms-3">✅ Plan Completed</span>}
          </h2>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/plans/edit/${id}`)}>
              Edit
            </button>
            <button className="btn btn-outline-danger" onClick={handleDeletePlan}>
              Delete
            </button>
          </div>
        </div>

        <p className="text-muted">Skill: {plan.skill}</p>
        <p>{plan.description}</p>

        <div className="mb-2">
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
                style={{
                  backgroundColor: bgColor,
                  color: 'white',
                  padding: '0.5em 0.75em',
                  fontSize: '0.75rem'
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        <p>
          <strong>Learning Period:</strong> {plan.learningPeriodInDays} days
        </p>
        <p>
          <strong>Visibility:</strong> {plan.isPublic ? '🌐 Public' : '🔒 Private'}
        </p>

        <hr />

        {!plan.started && (
          <button className="btn btn-success my-3" onClick={handleStartPlan}>
            Start Plan
          </button>
        )}

        {plan.started && (
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

            {plan.completed && (
              <div className="alert alert-success text-center mt-3">
                🎉 Congratulations! You have completed this learning plan.
              </div>
            )}
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
                      }
                    }}
                  />
                  <label className="form-check-label">
                    <strong>{task.title}</strong>
                    <br />
                    <small>{task.description}</small>
                    <br />
                    <small className="text-muted">
                      Due: {task.dueDate?.slice(0, 10)} | Duration: {task.durationInDays} days
                    </small>
                  </label>
                </div>
                <span className={`badge ${task.completed ? 'bg-success' : 'bg-warning text-dark'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* View Plan Progress Button */}
        <button className="btn btn-info mt-3 mb-5" onClick={handleViewProgress}>
          View Plan Progress
        </button>

        <WebSocketNotifications />
      </div>
    </>
  );
};

export default PlanViewPage;
