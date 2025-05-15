import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

class CommentService {
  // Helper method to get the config with Authorization header
  getConfig() {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      throw new Error("No access token found. Please log in again.");
    }
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  // Create a new comment and return the full comment object
  async createComment(commentData) {
    try {
      const config = this.getConfig();
      const response = await axios.post(`${BASE_URL}/comments`, commentData, config);
      return response.data; // ✅ Return the full comment (with id, user info, etc.)
    } catch (error) {
      console.error("Error creating comment:", error.response ? error.response.data : error.message);
      throw new Error("Failed to create comment: " + (error.response?.data?.message || error.message));
    }
  }

  // Get all comments for a specific post
  async getCommentsByPostId(postId) {
    try {
      const config = this.getConfig();
      const response = await axios.get(`${BASE_URL}/comments/post/${postId}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error.response ? error.response.data : error.message);
      throw new Error("Failed to get comments by post ID: " + (error.response?.data?.message || error.message));
    }
  }

  // Update an existing comment
  async updateComment(commentId, commentData) {
    try {
      const config = this.getConfig();
      const response = await axios.put(`${BASE_URL}/comments/${commentId}`, commentData, config);
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error.response ? error.response.data : error.message);
      throw new Error("Failed to update comment: " + (error.response?.data?.message || error.message));
    }
  }

  // Delete a comment
  async deleteComment(commentId) {
    try {
      const config = this.getConfig();
      await axios.delete(`${BASE_URL}/comments/${commentId}`, config);
    } catch (error) {
      console.error("Error deleting comment:", error.response ? error.response.data : error.message);
      throw new Error("Failed to delete comment: " + (error.response?.data?.message || error.message));
    }
  }
}

export default new CommentService();
