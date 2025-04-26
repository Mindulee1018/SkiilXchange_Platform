// pages/auth/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar";

const UserProfilePage = () => {
  const { id } = useParams(); // id of the user being viewed
  const [user, setUser] = useState(null);
  const [publicPlans, setPublicPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/auth/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          throw new Error("Failed to load user profile");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading user profile");
      }
    };

    const fetchUserPublicPlans = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/public`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      
        if (!res.ok) throw new Error('Failed to fetch plans');
      
        const allPlans = await res.json();
        const userPlans = allPlans.filter(plan => plan.userId === id); // ✅ Correctly filtered
        setPublicPlans(userPlans);
      };

    if (id) {
      fetchUserProfile();
      fetchUserPublicPlans();
    }
    setLoading(false);
  }, [id]);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">{error}</div>;
 

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {user && (
          <div className="text-center mb-4">
            <img
              src={user.profilePicture || "https://via.placeholder.com/100"}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <h2 className="mt-3">{user.username}</h2>
            <p className="text-muted">{user.description || 'No description provided.'}</p>
          </div>
        )}

        <h4 className="mb-3">Public Learning Plans</h4>
        {publicPlans.length === 0 ? (
          <p>This user has no public plans.</p>
        ) : (
          <div className="row">
            {publicPlans.map(plan => (
              <div key={plan.id} className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{plan.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{plan.skill}</h6>
                    <p className="card-text">{plan.description}</p>
                    <div className="text-muted small">
                      {plan.tags?.map((tag, i) => (
                        <span key={i} className="badge bg-secondary me-1">{tag}</span>
                      ))}
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

export default UserProfilePage;