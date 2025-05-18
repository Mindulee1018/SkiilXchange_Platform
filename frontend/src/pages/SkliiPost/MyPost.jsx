import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Modal, message, Button, Tooltip } from "antd";
import { LikeOutlined, LikeFilled, CommentOutlined } from "@ant-design/icons";
import { Col, Row } from "react-bootstrap";

import Navbar from "../../components/common/navbar";
import SkillPostUploader from "./SkillPostUploader";
import EditPostModal from "./EditPostModal";
import PostService from "../../services/PostService";
import LikeService from "../../services/LikeService";
import useProfile from "../../hooks/useProfile";
import CommentSection from "../../pages/comment/CommentSection";
import state from "../../util/Store";

import "../../Styles/MyPost.css";
import "antd/dist/reset.css";

const MyPost = () => {
  const snap = useSnapshot(state);
  const { profile } = useProfile();

  const [userPosts, setUserPosts] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({}); // { postId: [likes] }
  const [userLikes, setUserLikes] = useState(new Set()); // postIds liked by current user

  // Fetch posts of current user & their likes
  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const posts = await res.json();
      setUserPosts(posts);
      fetchLikesForPosts(posts);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  // Fetch likes for each post & track if user liked it
  const fetchLikesForPosts = async (posts) => {
    const allLikes = {};
    const userLikedPosts = new Set();

    for (const post of posts) {
      try {
        const likeList = await LikeService.getLikesByPostId(post.id);
        allLikes[post.id] = likeList;
        if (likeList.some((like) => like.userId === profile?.id)) {
          userLikedPosts.add(post.id);
        }
      } catch (err) {
        console.error(`Error fetching likes for post ${post.id}:`, err);
      }
    }
    setLikes(allLikes);
    setUserLikes(userLikedPosts);
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
          fetchUserPosts(profile.id);
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

  // Toggle like/unlike on a post
  const handleLikeToggle = async (postId) => {
    try {
      if (userLikes.has(postId)) {
        await LikeService.deleteLikeByPostId(postId);
        setUserLikes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
        setLikes((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((like) => like.userId !== profile?.id),
        }));
      } else {
        const newLike = await LikeService.createLike({ postId });
        setUserLikes((prev) => new Set(prev).add(postId));
        setLikes((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newLike],
        }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      message.error("Failed to update like");
    }
  };

  return (
    <>
      <div className="fixed-top bg-white shadow-sm z-3">
        <Navbar />
      </div>

      <div className="container mt-5 pt-5">
        <div
          className="card shadow-sm create-post-card border-primary mx-auto"
          style={{ maxWidth: "600px", cursor: "pointer" }}
          onClick={() => (state.uploadPostModalOpened = true)}
        >
          <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
            <i className="fas fa-plus-circle fa-3x text-primary mb-3"></i>
            <h5 className="card-title text-primary">
              Share Your Skill With the Community
            </h5>
            <p className="card-text text-muted mb-0">
              Click here to create a new skill-sharing post
            </p>
          </div>
        </div>

        <SkillPostUploader />
        <EditPostModal />

        <h4 className="mb-4 text-center">Your Posts</h4>

        {userPosts.length === 0 ? (
          <p className="text-center">This user has not shared any skill posts.</p>
        ) : (
          <Row>
            {userPosts.map((post) => (
              <Col xs={12} sm={6} md={4} key={post.id} className="mb-4 d-flex justify-content-center">
                <div className="card shadow-sm post-card" style={{ width: "100%", maxWidth: "500px" }}>
                  <div className="card-body d-flex flex-column">
                    <p className="text-dark mb-3">{post.contentDescription}</p>


                    {post.mediaType?.startsWith("image") && (
                      <img
                        src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, "")}`}
                        alt="Post"
                        className="img-fluid rounded mb-3"
                        style={{ objectFit: "cover", height: "350px", width: "100%" }}
                      />
                    )}

                    {post.mediaType?.startsWith("video") && (
                      <video
                        controls
                        src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, "")}`}
                        className="w-100 mb-3 rounded"
                        //style={{ height: "200px" }}
                      />
                    )}

                    <small className="text-muted">
                      Posted on {new Date(post.timestamp).toLocaleString()}
                    </small>

                    <div className="mt-2 d-flex align-items-center gap-2">
                      <Tooltip title="Like">
                        <Button
                          type="text"
                          icon={
                            userLikes.has(post.id) ? (
                              <LikeFilled style={{ color: "#1890ff" }} />
                            ) : (
                              <LikeOutlined />
                            )
                          }
                          onClick={() => handleLikeToggle(post.id)}
                        />
                      </Tooltip>
                      <span>{likes[post.id]?.length || 0} Likes</span>

                      <Button
                        type="text"
                        onClick={() => openCommentModal(post)}
                        icon={<CommentOutlined />}
                      >
                        Comment
                      </Button>

                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </button>
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
