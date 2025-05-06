import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api"; 

const CommentCard = ({ comment }) => {
  const [userData, setUserData] = useState();

  const fetchUserData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      // Direct API call to fetch user profile by comment.userId
      const response = await axios.get(`${BASE_URL}/users/${comment.userId}`, config);

      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
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
        {userData && (
          <div className="comment-container">
            <Avatar
              className="comment-avatar"
              src={userData.image}
              size={40}
            />
            <div className="comment-content">
              <div className="comment-user">{userData.username || "User"}</div>
              <h4 className="comment-text">{comment.commentText}</h4>
              {comment.createdAt && (
                <div className="comment-time">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </List.Item>
    </>
  );
};

export default CommentCard;
