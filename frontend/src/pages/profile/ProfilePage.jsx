// pages/auth/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import NotificationPanel from '../../components/common/NotificationPanel';
import Navbar from '../../components/common/navbar';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import { BsBellFill } from 'react-icons/bs';

const ProfilePage = () => {
  const { profile, loading, error } = useProfile();

  const [publicPlans, setPublicPlans] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProgressUpdates, setShowProgressUpdates] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    setShowProgressUpdates(false);
  };

  const toggleProgressUpdates = () => {
    setShowProgressUpdates(prev => !prev);
    setShowNotifications(false);
  };

  const fetchPublicPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/learning-plans/user/public', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPublicPlans(data);
      }
    } catch (err) {
      console.error('Error fetching public plans', err);
    }
  };

  const fetchFollowersAndFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = profile?.id;

      if (userId) {
        const followersRes = await fetch(`http://localhost:8080/api/users/${userId}/followers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const followingRes = await fetch(`http://localhost:8080/api/users/${userId}/following`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (followersRes.ok) setFollowersList(await followersRes.json());
        if (followingRes.ok) setFollowingList(await followingRes.json());
      }
    } catch (err) {
      console.error('Error fetching followers/following', err);
    }
  };

  const fetchProgressUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/progress-updates/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProgressUpdates(data);
      } else {
        console.error('Failed to fetch progress updates');
      }
    } catch (err) {
      console.error('Error fetching progress updates', err);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchPublicPlans();
      fetchFollowersAndFollowing();
      fetchProgressUpdates();
    }
  }, [profile]);

  if (loading) return <div className="container mt-5">Loading profile...</div>;
  if (error) return <div className="container mt-5">{error}</div>;

  return (
    <>
      <Navbar />

      <div className="container-fluid mt-5 px-0">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <ProfileSidebar isCollapsed={isCollapsed} toggleCollapse={toggleSidebar} />
          </div>

          <div className="col-md-9">
            <div className="position-relative mb-4">
              {/* Notification Buttons Top-Right */}
              <div className="position-absolute top-0 end-0 d-flex gap-2">
                <button onClick={toggleProgressUpdates} className="btn btn-outline-success">
                  Progress Updates
                </button>
                <button onClick={toggleNotifications} className="btn btn-outline-warning">
                  <BsBellFill />
                </button>
              </div>

              {/* Notifications */}
              {showNotifications && (
                <div className="mt-2 bg-white shadow-lg rounded-lg w-100" style={{ maxWidth: '300px' }}>
                  <NotificationPanel />
                </div>
              )}

              {/* Progress Updates */}
              {showProgressUpdates && (
                <div className="mt-2 bg-white shadow-lg rounded-lg w-100" style={{ maxWidth: '300px' }}>
                  <div className="p-3">
                    <h6>Progress Updates</h6>
                    {progressUpdates.length === 0 ? (
                      <p>No progress updates yet.</p>
                    ) : (
                      <ul className="list-group">
                        {progressUpdates.map(update => (
                          <li key={update.id} className="list-group-item small">
                            {update.message || `${update.planTitle} - Day ${update.dayCompleted} completed`}
                            <br />
                            <small className="text-muted">
                              {new Date(update.timestamp).toLocaleString()}
                            </small>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Info */}
              <div className="text-center">
                <img
                  src={profile.profilePicture || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <h2 className="mt-3">{profile.username}</h2>
                <p className="text-muted">{profile.description || 'No description provided.'}</p>
              </div>
            </div>

            {/* Follower Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-2">
              <Button variant="outline-primary" size="sm" onClick={() => setShowFollowers(true)}>
                Followers ({profile.followers})
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowFollowing(true)}>
                Following ({profile.following})
              </Button>
            </div>

            <hr />

            {/* Public Plans */}
            <h4 className="mb-3">Your Public Learning Plans</h4>
            {publicPlans.length === 0 ? (
              <p>You have no public plans yet.</p>
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

            {/* Followers Modal */}
            <Modal show={showFollowers} onHide={() => setShowFollowers(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Followers</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {followersList.length === 0 ? (
                  <p>No followers yet.</p>
                ) : (
                  <ul className="list-group">
                    {followersList.map((follower, index) => (
                      <li key={index} className="list-group-item">
                        <Link to={`/user/${follower.id}`} className="text-decoration-none">
                          {follower.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>

            {/* Following Modal */}
            <Modal show={showFollowing} onHide={() => setShowFollowing(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Following</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {followingList.length === 0 ? (
                  <p>Not following anyone yet.</p>
                ) : (
                  <ul className="list-group">
                    {followingList.map((user, index) => (
                      <li key={index} className="list-group-item">
                        <Link to={`/user/${user.id}`} className="text-decoration-none">
                          {user.username}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
