// pages/plan/PublicPlansPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';

const PublicPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
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
        <h2 className="mb-4">Explore Public Learning Plans</h2>

        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title, skill, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="">Filter by tag</option>
              {[...new Set(plans.flatMap(plan => plan.tags || []))].map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <p>No matching public plans found.</p>
        ) : (
          <div className="row">
            {filteredPlans.map(plan => (
              <div key={plan.id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm" onClick={() => navigate(`/plans/view/${plan.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="card-body">
                    <h5 className="card-title">{plan.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                    <p className="card-text">{plan.description}</p>
                    <div className="mb-2">
                      {plan.tags?.map((tag, i) => (
                        <span key={i} className="badge bg-secondary me-1">{tag}</span>
                      ))}
                    </div>
                    <div className="text-muted small">
                      Created on: {new Date(plan.createdAt).toLocaleDateString()}
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