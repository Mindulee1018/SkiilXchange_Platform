import axios from "axios";
//import NotificationService from "./NotificationService";
import authService from "./authService";  // Assumed to be your auth-related service

const BASE_URL = "http://localhost:8080/api"; // or your actual backend base URL

class CommentService {
  // Create a new Comment
  async createComment(commentData, username, userId) {
  try {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      console.warn("Access token missing.");
      throw new Error("No access token found. Please log in again.");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await axios.post(
      `${BASE_URL}/comments`,
      commentData,
      config
    );


      // Uncomment and modify if you want to notify users about the comment
      /* 
      if (response.status === 200) {
        try {
          const body = {
            userId: userId,
            message: "You have a new comment",
            description: "Your post has been commented on by " + username,
          };

          await NotificationService.createNotification(body);
        } catch (error) {
          console.error("Error creating notification:", error);
        }
      }
      */

      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error("Failed to create comment"+ error.message);
    }
  }

  // Get all comments for a specific post
  async getCommentsByPostId(postId) {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(
        `${BASE_URL}/comments/post/${postId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error("Failed to get comments by post ID");
    }
  }

  // Update an existing comment
  async updateComment(commentId, commentData) {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.put(
        `${BASE_URL}/comments/${commentId}`,
        commentData,
        config
      );

      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw new Error("Failed to update comment");
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const accessToken = localStorage.getItem("token");
      if (!accessToken) {
        throw new Error("No access token found. Please log in again.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      await axios.delete(`${BASE_URL}/comments/${commentId}`, config);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error("Failed to delete comment");
    }
  }
}

export default new CommentService();
