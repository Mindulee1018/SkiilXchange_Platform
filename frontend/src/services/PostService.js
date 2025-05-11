import axios from "axios";
const API_BASE = 'http://localhost:8080/api/posts';

class PostService {
  async createPost(postData) {
    try {
      const token = localStorage.getItem("token");
  
      const response = await axios.post(`${API_BASE}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      throw new Error("Failed to create post");
    }
  }

  async getPosts() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }

  async getPostsByUser(userId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/posts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }

  async getPostById(postId) {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASE}/${postId}`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  }

  async updatePost(postId, postData) {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${API_BASE}/${postId}`,
        postData,
        config
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to update post");
    }
  }

  async deletePost(postId) {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_BASE}/${postId}`, config);
    } catch (error) {
      throw new Error("Failed to delete post");
    }
  }
}

export default new PostService();
