// src/pages/SearchPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const SearchPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followedTags, setFollowedTags] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const tag = queryParams.get('tag') || '';

  useEffect(() => {
    const fetchPlansByTag = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/public/tag/${encodeURIComponent(tag)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        setError('Error loading results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const fetchFollowedTags = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:8080/api/users/tags', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFollowedTags(data);
            setIsFollowing(data.includes(tag.toLowerCase()));
          }
        } catch (err) {
          console.error('Failed to load followed tags', err);
        }
      };
      
      if (tag) {
        fetchPlansByTag();
        fetchFollowedTags();
      }
  }, [tag]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Search Results for "{tag}"</h3>
        <button
            className={`btn btn-sm ${isFollowing ? 'btn-outline-danger' : 'btn-outline-primary'}`}
            onClick={async () => {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/users/tags/${isFollowing ? 'unfollow' : 'follow'}?tag=${encodeURIComponent(tag)}`;
            const method = isFollowing ? 'DELETE' : 'POST';

            try {
                const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });

                if (res.ok) {
                setIsFollowing(!isFollowing);
                }
            } catch (err) {
                console.error('Error updating tag follow status:', err);
            }
            }}
        >
            {isFollowing ? 'Unfollow Tag' : 'Follow Tag'}
        </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && plans.length === 0 && <p>No plans found with that tag.</p>}

        <div className="row">
          {plans.map((plan) => (
            <div key={plan.id} className="col-md-6 mb-4">
              <div className="card h-100 shadow-sm" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                  <h5 className="card-title">{plan.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                  <p className="card-text">{plan.description}</p>
                  <div className="mb-2">
                    {plan.tags?.map((t, i) => (
                      <span
                        key={i}
                        className="badge bg-secondary me-1"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/search?tag=${t}`);
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="text-muted small">
                    {plan.isPublic ? '🌐 Public' : '🔒 Private'} • Created: {new Date(plan.createdAt).toLocaleDateString()}
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

export default SearchPage;
