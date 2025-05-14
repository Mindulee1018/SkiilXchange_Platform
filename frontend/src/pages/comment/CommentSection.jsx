import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  List,
  Row,
  Input,
  Col,
  Avatar,
  Dropdown,
  Menu,
  message,
  Divider,
  Tooltip,
  Badge,
  Popconfirm
} from "antd";
import {
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import CommentService from "../../services/CommentService";

const CommentSection = ({ open, onClose, post }) => {
  const snap = useSnapshot(state);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentAdding, setCommentAdding] = useState(false);
  const [updatingCommentText, setUpdatingCommentText] = useState("");
  const [updatingCommentId, setUpdatingCommentId] = useState(null);
  const [editFocused, setEditFocused] = useState(false);
  const [commentUploading, setCommentUploading] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState(false);

  // Fetch comments for the selected post
  const getCommentsRelatedToPost = async (postId) => {
    try {
      const result = await CommentService.getCommentsByPostId(postId);
      setComments(result);  // Update state with the fetched comments
    } catch (error) {
      console.error("Error fetching comments:", error);
      message.error("Failed to load comments");
    }
  };

  useEffect(() => {
    if (open && post?.id) {
      getCommentsRelatedToPost(post.id);
    }
  }, [open, post]);

  const createComment = async () => {
    if (comment) {
      try {
        setCommentAdding(true);
        const body = {
          postId: post.id,
          commentText: comment,
        };
        await CommentService.createComment(body);
        setComment("");  // Clear input after sending the comment

        // Optimistically update the comments list
        const newComment = {
          postId: post.id,
          commentText: comment,
        };
        setComments([...comments, newComment]);

        message.success("Comment added");
      } catch (error) {
        message.error("Failed to add comment");
      } finally {
        setCommentAdding(false);
      }
    }
  };
  

  const updateComment = async (id) => {
    if (updatingCommentText.trim()) {
      try {
        setCommentUploading(true);
        await CommentService.updateComment(id, {
          commentText: updatingCommentText,
        });

        // Optimistically update the comment in the list
        setComments(comments.map((c) => (c.id === id ? { ...c, commentText: updatingCommentText } : c)));
        setUpdatingCommentText("");
        setEditFocused(false);
        setUpdatingCommentId(null);
      } catch (error) {
        message.error("Failed to update comment");
      } finally {
        setCommentUploading(false);
      }
    } else {
      message.error("Comment text cannot be empty");
    }
  };

  const deleteComment = async (id) => {
    try {
      setCommentDeleting(true);
      await CommentService.deleteComment(id);

      // Optimistically remove the comment from the list
      setComments(comments.filter((comment) => comment.id !== id));
      message.success("Comment deleted");
    } catch (error) {
      message.error("Failed to delete comment");
    } finally {
      setCommentDeleting(false);
    }
  };

  return (
    <Modal
      title={`Comments on "${post.title}"`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <div className="comment-input">
        <Avatar src={snap.currentUser?.image} size={36} />
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
          disabled={!comment}
          loading={commentAdding}
        />
      </div>

      <List
        className="comments-list"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={(comment) => (
          <Row className="comment-item" key={comment.id}>
            <Col span={19}>
              {editFocused && updatingCommentId === comment.id ? (
                <Input
                  value={updatingCommentText}
                  onChange={(e) => setUpdatingCommentText(e.target.value)}
                  autoFocus
                  onBlur={() => setEditFocused(false)}
                />
              ) : (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={snap.currentUser?.image} />}
                    title={snap.currentUser?.username}
                    description={comment.commentText}
                  />
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    onClick={() => {
                      setUpdatingCommentId(comment.id);
                      setUpdatingCommentText(comment.commentText);
                      setEditFocused(true);
                    }}
                  />
                </List.Item>
              )}
            </Col>
            {editFocused && updatingCommentId === comment.id && (
              <Col
                span={5}
                style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
              >
                {snap.currentUser?.id === comment.userId && (
                  <>
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
                  </>
                )}
              </Col>
            )}
          </Row>
        )}
      />
    </Modal>
  );
};

export default CommentSection;
