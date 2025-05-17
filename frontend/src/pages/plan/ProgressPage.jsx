import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar';
import '../../Styles/ProgressPage.css'; 
import ProgressTimeline from './ProgressTimeline';

const ProgressPage = () => {
  const { planId } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper to detect completed task messages
  const isTaskCompletedMessage = (message) =>
    message && message.toLowerCase().includes('complete');

  const getIcon = (type, message) => {
    if (isTaskCompletedMessage(message)) return '✅';
    switch (type) {
      case 'STARTED': return '🚀';
      case 'UPDATE': return '🔄';
      case 'COMPLETE': return '✅';
      case 'END': return '🏁';
      default: return '📌';
    }
  };

  const getColorClass = (type, message) => {
    if (isTaskCompletedMessage(message)) return 'bg-success';
    switch (type) {
      case 'STARTED': return 'bg-primary';
      case 'UPDATE': return 'bg-warning';
      case 'COMPLETE': return 'bg-info';
      case 'END': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/progress/${planId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch progress updates');
        }

        const data = await res.json();
        console.log('Progress updates:', data);  // Debug: check your data here
        setUpdates(data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [planId]);

  if (loading) return <div className="container mt-5">Loading progress updates...</div>;

  return (
    <>
      <div className="fixed-top bg-white shadow-sm">
        <Navbar />
      </div>
      <div className="container mt-5">
        <h2 className="pt-5">Progress Timeline</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        {updates.length === 0 ? (
          <p>No updates found for this plan.</p>
        ) : (
          <ul className="timeline">
            {updates.map((update) => (
              <li className="timeline-item" key={update._id}>
                <div className={`timeline-icon ${getColorClass(update.type, update.message)}`}>
                  {getIcon(update.type, update.message)}
                </div>
                <div className="timeline-content">
                  <h5>{isTaskCompletedMessage(update.message) ? 'Task Completed' : update.type}</h5>
                  <p>{update.message}</p>
                  <small className="text-muted">{new Date(update.timestamp).toLocaleString()}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProgressPage;
