import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  List,
  Input,
  Avatar,
  message,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import CommentCard from "./CommentCard";
import authService from "../../services/authService";
import CommentService from "../../services/CommentService";

const CommentSection = ({ open, onClose, post }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentAdding, setCommentAdding] = useState(false);
  const [updatingCommentText, setUpdatingCommentText] = useState("");
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [commentUploading, setCommentUploading] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (open && post?.id) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
          const result = await CommentService.getCommentsByPostId(post.id);
          setComments(result);
        } catch (err) {
          console.error("Failed to load comments or user", err);
          message.error("Error loading comment section.");
        }
      }
    };

    loadData();
  }, [open, post]);

  //create comment
  const createComment = async () => {
    if (!comment.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }

    try {
      setCommentAdding(true);
      const body = { postId: post.id, commentText: comment };
      const newComment = await CommentService.createComment(body);
      setComments([...comments, newComment]);
      setComment("");
      message.success("Comment added");
    } catch (error) {
      message.error("Failed to add comment");
    } finally {
      setCommentAdding(false);
    }
  };

//update comment
  const updateComment = async (id) => {
    if (!updatingCommentText.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }

    try {
      setCommentUploading(true);
      const updated = await CommentService.updateComment(id, {
        commentText: updatingCommentText,
      });

      setComments(comments.map((c) => (c.id === id ? updated : c)));
      setUpdatingCommentText("");
      setUpdatingCommentId(null);
    } catch (error) {
      message.error("Failed to update comment");
    } finally {
      setCommentUploading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      setCommentDeleting(true);
      await CommentService.deleteComment(id);
      setComments(comments.filter((c) => c.id !== id));
      message.success("Comment deleted");
    } catch (error) {
      message.error("Failed to delete comment");
    } finally {
      setCommentDeleting(false);
    }
  };

  return (
    <Modal
      title={`Comments on "${post.title || post.description || "this post"}"`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div className="comment-input" style={{ display: "flex", gap: "8px", marginBottom: 12 }}>
        <Avatar src={currentUser?.profilePicture} size={36} />
        <Input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onPressEnter={createComment}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={createComment}
          loading={commentAdding}
        />
      </div>

      <List
        dataSource={comments}
        renderItem={(comment) => {
          const isCommentOwner = currentUser?.id === comment.userId;

          return (
            <div key={comment.id} style={{ position: "relative" }}>
              {updatingCommentId === comment.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Input
                    value={updatingCommentText}
                    onChange={(e) => setUpdatingCommentText(e.target.value)}
                    autoFocus
                  />
                  <Tooltip title="Save">
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => updateComment(comment.id)}
                      loading={commentUploading}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="Are you sure you want to delete this comment?"
                    onConfirm={() => deleteComment(comment.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Delete">
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        loading={commentDeleting}
                      />
                    </Tooltip>
                  </Popconfirm>
                </div>
              ) : (
                <>
                  <CommentCard comment={comment} />
                  {isCommentOwner && (
                    <Button
                      type="text"
                      size="small"
                      icon={<MoreOutlined />}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#f0f0f0",
                        zIndex: 10,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        borderRadius: "50%",
                      }}
                      onClick={() => {
                        setUpdatingCommentId(comment.id);
                        setUpdatingCommentText(comment.commentText);
                      }}
                    />
                  )}
                </>
              )}
            </div>
          );
        }}
      />
    </Modal>
  );
};

export default CommentSection;