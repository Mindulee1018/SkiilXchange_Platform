import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const ForYouPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForYouPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/learning-plans/foryou', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch For You content');

        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error(err);
        setError('Error loading your personalized feed.');
      } finally {
        setLoading(false);
      }
    };

    fetchForYouPlans();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">For You</h2>
        {loading && <p>Loading personalized feed...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && plans.length === 0 && <p>No personalized plans found.</p>}
        
        <div className="row">
          {plans.map(plan => (
            <div key={plan.id} className="col-md-6 mb-4">
              <div
                className="card h-100 shadow-sm"
                onClick={() => navigate(`/plans/view/${plan.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <h5 className="card-title">{plan.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                  <p className="card-text">{plan.description}</p>
                  <div className="mb-2">
                    {plan.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="badge bg-secondary me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/search?tag=${tag}`);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-muted small">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ForYouPage;