// src/pages/auth/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/common/navbar";
import "../../Styles/MyPost.css";
import CommentSection from "../../pages/comment/CommentSection";
import { useSnapshot } from "valtio";
import state from "../../util/Store";

function parseJwt(token) {
  if (!token) return {};
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [publicPlans, setPublicPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const snap = useSnapshot(state);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeTab, setActiveTab] = useState("plans");

  const [notifications, setNotifications] = useState([]);

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
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/learning-plans/public`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const allPlans = await res.json();
          const userPlans = allPlans.filter(plan => plan.userId === id);
          setPublicPlans(userPlans);
        }
      } catch (err) {
        console.error('Failed to fetch plans', err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const posts = await res.json();
        setUserPosts(posts);
      } catch (err) {
        console.error("Error fetching user's posts:", err);
      }
    };

    const checkIfFollowing = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`http://localhost:8080/api/users/${id}/followers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch followers');

        const followersList = await res.json();
        const tokenUsername = parseJwt(token).sub; // 👈 extract your username from JWT

        const isFollowing = followersList.some(follower => follower.username === tokenUsername);
        setIsFollowing(isFollowing);
      } catch (err) {
        console.error('Failed to check following status', err);
      }
    };

    if (id) {
      fetchUserProfile();
      fetchUserPublicPlans();
      checkIfFollowing();
      fetchUserPosts();
    }
    setLoading(false);
  }, [id]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const notificationsData = await res.json();
        setNotifications(notificationsData);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:8080/api/users/${id}/${isFollowing ? 'unfollow' : 'follow'}`;
      const method = isFollowing ? 'DELETE' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setIsFollowing(!isFollowing);
        setUser(prev => ({
          ...prev,
          followers: prev.followers + (isFollowing ? -1 : 1)  // 👈 update follower count immediately
        }));
        fetchNotifications();
      }
    } catch (err) {
      console.error('Error updating follow status:', err);
    }
  };




  const openCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        {user && (
          <div className="text-center mb-4">
            <img
              src={user.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"}
              alt="Profile"
              className="rounded-circle"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <h2 className="mt-3">{user.username}</h2>
            <p className="text-muted">{user.description || 'No description provided.'}</p>

            <button
              className={`btn btn-sm ${isFollowing ? 'btn-outline-danger' : 'btn-outline-primary'} mt-2`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        )}

        <div className="d-flex justify-content-center mt-4 mb-3">
          <button
            className={`btn btn-sm mx-2 ${activeTab === "plans" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("plans")}
          >
            Learning Plans
          </button>
          <button
            className={`btn btn-sm mx-2 ${activeTab === "posts" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab("posts")}
          >
            Skill Posts
          </button>
        </div>

        {/* Public Learning Plans */}
        {activeTab === "plans" && (
          <>
            <h4 className="mb-3">Learning Plans</h4>
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
          </>
        )}

        {activeTab === "posts" && (
          <>
            <h4 className="mb-3">Skill Posts</h4>
            {userPosts.length === 0 ? (
              <p>This user has not shared any skill posts.</p>
            ) : (
              <div className="row">
                {userPosts.map((post) => (
                  <div key={post.id} className="col-12 col-sm-6 col-md-4 mb-4">
                    <div className="card h-100 shadow-sm post-card">
                      <div className="card-body d-flex flex-column">
                        <p className="text-dark mb-2">{post.contentDescription}</p>

                        {post.mediaType?.startsWith("image") && (
                          <img
                            src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, '')}`}
                            alt="Post"
                            className="img-fluid rounded mb-3"
                            style={{ objectFit: "cover", height: "200px" }}
                          />
                        )}

                        {post.mediaType?.startsWith("video") && (
                          <video
                            controls
                            src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, '')}`}
                            className="w-100 mb-3 rounded"
                            style={{ height: "200px" }}
                          />
                        )}

                        <small className="text-muted mt-auto">
                          Posted on {new Date(post.timestamp).toLocaleString()}
                        </small>
                        <div className="d-flex justify-content-between mt-2">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => openCommentModal(post)}>Comment</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {/* Comment Modal */}
        {selectedPost && (
          <CommentSection
            open={commentModalOpen}
            onClose={() => setCommentModalOpen(false)}
            post={selectedPost}
          />
        )}
        {/* Skill Post Edit Modal */}
        {snap.editPostModalOpened && (
          <EditPostModal />
        )}
      </div>
    </>
  );
};

export default UserProfilePage;