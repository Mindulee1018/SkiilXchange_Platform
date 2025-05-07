import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const ProgressPage = () => {
  const { planId } = useParams();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <Navbar />
      <div className="container mt-5">
        <h2>Progress Updates</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        {updates.length === 0 ? (
          <p>No updates found for this plan.</p>
        ) : (
          <ul className="list-group">
            {updates.map((update) => (
              <li key={update._id} className="list-group-item">
                <strong>{update.type}:</strong> {update.message} <br />
                <small className="text-muted">
                  {new Date(update.timestamp).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProgressPage;
