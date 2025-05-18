import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/navbar';
import "../../Styles/MyPost.css";
import CommentSection from "../../pages/comment/CommentSection";
import { useSnapshot } from "valtio";
import state from "../../util/Store";

const ForYouPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("plans");
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const snap = useSnapshot(state);
  const [selectedPost, setSelectedPost] = useState(null);
  const [usernames, setUsernames] = useState({});

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

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

    const fetchForYouPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8080/api/posts/foryou', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch For You posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error loading For You posts', err);
      }
    };

    fetchForYouPlans();
    fetchForYouPosts();
  }, []);

  useEffect(() => {
    const allUserIds = [...new Set([...plans.map(p => p.userId), ...posts.map(p => p.userId)])];
    allUserIds.forEach(userId => {
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
  }, [plans, posts, usernames]);

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">For You</h2>
        {loading && <p>Loading personalized feed...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
  
        <div className="d-flex justify-content-center mb-4">
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

      
      {activeTab === "plans" && (
      <>
        <h4 className="mb-3">Recommended Learning Plans</h4>
        {plans.length === 0 ? (
          <p>No personalized plans found.</p>
        ) : (
        <div className="row">
          {plans.map(plan => (
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
                  <div className="mb-2">
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
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
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
          <h4 className="mb-3">Recommended Skill Posts</h4>
          {posts.length === 0 ? (
            <p>No skill posts to recommend.</p>
          ) : (
            <div className="row">
              {posts.map(post => (
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

export default ForYouPage;