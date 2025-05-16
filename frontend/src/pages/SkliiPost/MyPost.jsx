import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Modal, message } from "antd";
import state from "../../util/Store";
import SkillPostUploader from "./SkillPostUploader";
import EditPostModal from "./EditPostModal";
import PostService from "../../services/PostService";
import useProfile from "../../hooks/useProfile";
import CommentSection from "../../pages/comment/CommentSection"; // Import CommentSection
import "../../Styles/MyPost.css";
import "antd/dist/reset.css";
import Navbar from "../../components/common/navbar";
import { Row, Col } from "react-bootstrap";

const MyPost = () => {
  const snap = useSnapshot(state);
  const { profile } = useProfile();
  const [userPosts, setUserPosts] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const posts = await res.json();
      setUserPosts(posts);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  useEffect(() => {
    if (profile?.id) {
      fetchUserPosts(profile.id);
    }
  }, [profile, snap.uploadPostModalOpened, snap.editPostModalOpened]);

  const handleEdit = (post) => {
    state.selectedPost = post;
    state.editPostModalOpened = true;
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      onOk: async () => {
        try {
          await PostService.deletePost(id);
          message.success("Post deleted");
          fetchUserPosts();
        } catch (err) {
          console.error("Failed to delete post", err);
          message.error("Failed to delete post");
        }
      },
    });
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setCommentModalOpen(true);
  };

  return (
    <>
      <div className="fixed-top bg-white shadow-sm z-3">
        <Navbar />
      </div>

      <div className="container mt-5 pt-5">
        {/* Create Post */}
        <div className="text-center mb-5">
          <div
            className="card shadow-sm create-post-card border-primary mx-auto"
            style={{ maxWidth: "600px", cursor: "pointer" }}
            onClick={() => (state.uploadPostModalOpened = true)}
          >
            <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
              <i className="fas fa-plus-circle fa-3x text-primary mb-3"></i>
              <h5 className="card-title text-primary">Share Your Skill With the Community</h5>
              <p className="card-text text-muted mb-0">Click here to create a new skill-sharing post</p>
            </div>
          </div>
        </div>

        <SkillPostUploader />
        <EditPostModal />

        <h4 className="mb-4 text-center">Your Posts</h4>

        {userPosts.length === 0 ? (
          <p className="text-center">This user has not shared any skill posts.</p>
        ) : (
          <Row gutter={[24, 24]}>
            {userPosts.map((post) => (
              <Col xs={24} sm={12} md={8} lg={6} key={post.id} className="mb-4">
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

                    <small className="text-muted mb-3 mt-auto">
                      Posted on {new Date(post.timestamp).toLocaleString()}
                    </small>

                    <div className="d-flex justify-content-between mt-2">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(post)}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>Delete</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => openCommentModal(post)}>Comment</button>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {selectedPost && (
          <CommentSection
            open={commentModalOpen}
            onClose={() => setCommentModalOpen(false)}
            post={selectedPost}
          />
        )}
      </div>
    </>
  );
};

export default MyPost;
