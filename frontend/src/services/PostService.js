import axios from "axios";
const API_BASE = 'http://localhost:8080/api/auth';



class PostService {
  async createPost(postData, file) {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const formData = new FormData();
      formData.append("post", new Blob([JSON.stringify(postData)], { type: "application/json" }));
      if (file) {
        formData.append("file", file);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(`${API_BASE}/upload`, formData, config);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create post with file");
    }
  }

  async getPosts() {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`${API_BASE}/posts`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get posts");
    }
  }

  async getPostById(postId) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get(`${API_BASE}/posts/${postId}`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get post");
    }
  }

  async updatePost(postId, postData) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios.put(
        `${API_BASE}/posts/${postId}`,
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
      const accessToken = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      await axios.delete(`${API_BASE}/posts/${postId}`, config);
    } catch (error) {
      throw new Error("Failed to delete post");
    }
  }
}

export default new PostService();
