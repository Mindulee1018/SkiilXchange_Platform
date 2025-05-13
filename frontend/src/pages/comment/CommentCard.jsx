import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import axios from "axios";
import state from "../../util/Store";
// import UserService from "../../services/UserService"; // Uncomment if needed

const BASE_URL = "http://localhost:8080/api/auth";

const CommentCard = ({ comment }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // If you have a UserService with getProfileById:
      // const result = await UserService.getProfileById(comment.userId);
      // const result2 = await axios.get(`${BASE_URL}/users/${result.userId}`, config);
      // setUserData({ ...result2.data, ...result });

      // Simpler direct fetch (if no UserService used)
      const result = await axios.get(`${BASE_URL}/users/${comment.userId}`, config);
      setUserData(result.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [comment.id]);

  return (
    <>
      <style>{`
        .comment-item {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s ease;
        }

        .comment-item:hover {
          transform: translateY(-2px);
        }

        .comment-container {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          gap: 16px;
          width: 100%;
        }

        .comment-avatar {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .comment-avatar:hover {
          transform: scale(1.05);
        }

        .comment-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .comment-user {
          font-size: 14px;
          font-weight: 600;
          color: #4e7df7;
          margin-bottom: 4px;
        }

        .comment-text {
          font-size: 15px;
          color: #333;
          margin: 0;
          line-height: 1.4;
          word-break: break-word;
        }

        .comment-time {
          font-size: 12px;
          color: #999;
          margin-top: 6px;
        }
      `}</style>

      <List.Item key={comment.id} className="comment-item">
        <div className="comment-container">
          <Avatar
            className="comment-avatar"
            onClick={() => {
              if (userData) {
                state.selectedUserProfile = userData;
                state.friendProfileModalOpened = true;
              }
            }}
            src={userData?.image}
            size={40}
          />
          <div className="comment-content">
            <div className="comment-user">
              {loading ? "Loading..." : userData?.username || "Unknown User"}
            </div>
            <h4 className="comment-text">{comment.commentText}</h4>
            {comment.createdAt && (
              <div className="comment-time">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </List.Item>
    </>
  );
};

export default CommentCard;
