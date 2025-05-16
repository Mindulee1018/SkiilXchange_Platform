import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Modal, message } from "antd";
import state from "../../util/Store";
import SkillPostUploader from "./SkillPostUploader";
import EditPostModal from "./EditPostModal";
import PostService from "../../services/PostService";
import useProfile from "../../hooks/useProfile";
import CommentSection from "../../pages/comment/CommentSection"; // Import CommentSection
import LikeService from "../../services/LikeService";
import "../../Styles/MyPost.css";
import "antd/dist/reset.css";
import {
  LikeOutlined,
  LikeFilled,
  CommentOutlined
} from "@ant-design/icons";
import {
  Button,
  List,
  Row,
  Input,
  Col,
  Avatar,
  Dropdown,
  Menu,
  Divider,
  Tooltip,
  Badge
} from "antd";

const MyPost = () => {
  const snap = useSnapshot(state);
  const [posts, setPosts] = useState([]);
  const { profile } = useProfile();
  const [userPosts, setUserPosts] = useState([]);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({}); // key: postId, value: array of likes
  const [userLikes, setUserLikes] = useState(new Set()); // holds postIds user has liked


  const fetchUserPosts = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const posts = await res.json();
      setUserPosts(posts);
      fetchLikesForPosts(posts);
      return posts;
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
    console.error("Error toggling like:", error.response?.data || error.message);
    message.error(error.response?.data || "Failed to update like");
  }
};


  return (
    <>
      <div
        onClick={() => {
          state.uploadPostModalOpened = true;
        }}
        className="my-post"
      >
        <div className="accent-bar"></div>
        <div className="post-content">
          <div className="post-icon">
            <i className="fas fa-edit"></i>
          </div>
          <div className="post-text">
            <div className="post-description">
              Create a new post to share with the community
            </div>
          </div>
        </div>
        <div className="hover-overlay"></div>
      </div>

      <SkillPostUploader />
      <EditPostModal />

      <h4 className="mb-3">Your Posts</h4>
      {userPosts.length === 0 ? (
        <p>This user has not shared any skill posts.</p>
      ) : (
        userPosts.map((post) => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <p>{post.contentDescription}</p>
                {post.mediaType?.startsWith("image") && (
                  <img
                    src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, '')}`}
                    alt="Post"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                  />
                )}
                {post.mediaType?.startsWith("video") && (
                  <video
                    controls
                    src={`http://localhost:8080/${post.mediaLink.replace(/^\/?/, '')}`}
                    style={{ width: '100%', maxHeight: 300 }}
                  />
                )}
                <small className="text-muted">
                  Posted on {new Date(post.timestamp).toLocaleString()}
                </small>
                <div className="mt-2 d-flex gap-2">
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
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(post)}>
                    Edit
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => openCommentModal(post)}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Comment Section Modal */}
      {selectedPost && (
        <CommentSection
          open={commentModalOpen}
          onClose={() => setCommentModalOpen(false)}
          post={selectedPost}
        />
      )}
    </>
  );
};

export default MyPost;