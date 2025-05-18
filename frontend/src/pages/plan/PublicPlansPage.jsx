// pages/plan/PublicPlansPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const PublicPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/learning-plans/public', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
          setFilteredPlans(data);
        }
      } catch (err) {
        console.error('Failed to fetch public plans', err);
      }
    };

    fetchPublicPlans();
  }, []);

  useEffect(() => {
    const uniqueUserIds = [...new Set(filteredPlans.map(plan => plan.userId))];
    uniqueUserIds.forEach(userId => {
      if (!userId || usernames[userId]) return;

      const fetchUsername = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:8080/api/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUsernames(prev => ({ ...prev, [userId]: data.username }));
          }
        } catch (err) {
          console.error(`Failed to fetch username for userId=${userId}`, err);
        }
      };

      fetchUsername();
    });
  }, [filteredPlans, usernames]);

  useEffect(() => {
    let filtered = plans;

    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(plan => plan.tags?.includes(selectedTag));
    }

    setFilteredPlans(filtered);
  }, [searchTerm, selectedTag, plans]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4 text-center fw-bold">🌟 Explore Public Learning Plans</h2>

        <div className="row mb-5 justify-content-center">
          <div className="col-md-5 mb-2">
            <input
              type="text"
              className="form-control shadow-sm"
              placeholder="🔍 Search by title, skill, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select shadow-sm"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">🎯 Filter by tag</option>
              {[...new Set(plans.flatMap(plan => plan.tags || []))].map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <p className="text-center text-muted fs-5">🚫 No matching public plans found.</p>
        ) : (
          <div className="row">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="col-md-6 mb-4">
                <div
                  className="card h-100 border-0 shadow-sm plan-card"
                  onClick={() => navigate(`/plans/view/${plan.id}`)}
                  style={{ cursor: 'pointer', transition: '0.3s ease' }}
                  onMouseEnter={e => e.currentTarget.classList.add('shadow-lg')}
                  onMouseLeave={e => e.currentTarget.classList.remove('shadow-lg')}
                >
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{plan.title}</h5>
                    <h6 className="card-subtitle mb-2 text-primary">{plan.skill}</h6>
                    <p className="card-text text-muted">{plan.description}</p>
                    <div className="mb-3">
                      {plan.tags?.map((tag, i) => {
                        const customColors = [
                          '#6f42c1', '#20c997', '#fd7e14', '#0dcaf0',
                          '#d63384', '#ffc107', '#198754', '#0d6efd'
                        ];
                        const bgColor = customColors[i % customColors.length];

                        return (
                          <span
                            key={i}
                            className="badge me-1 mb-1"
                            onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/search?tag=${tag}`);
                          }}
                            style={{
                              cursor: 'pointer',
                              backgroundColor: bgColor,
                              color: 'white',
                              padding: '0.45em 0.7em',
                              fontSize: '0.78rem',
                              borderRadius: '0.6rem'
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-muted small">
                      By:{' '}
                      <span
                        className="text-primary"
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/${plan.userId}`);
                        }}
                      >
                        {usernames[plan.userId] || 'Loading...'}
                      </span>
                    </div>
                    <div className="text-muted small">
                      🗓️ Created on: {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
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

export default PublicPlansPage;