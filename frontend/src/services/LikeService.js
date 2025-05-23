import axios from "axios";
//import NotificationService from "./NotificationService";
import authService from "./authService";

const BASE_URL = "http://localhost:8080/api";


class LikeService {
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

  //get likes-postId
  async getLikesByPostId(postId) {
    try {
      const config = this.getConfig();
      const response = await axios.get(`${BASE_URL}/likes/${postId}`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get likes by post ID");
    }
  }

  //create like
 async createLike({ postId }) {
  try {
    const config = this.getConfig();
    const response = await axios.post(`${BASE_URL}/likes/${postId}`, null, config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error("Already liked");
    }
    throw new Error("Failed to create like");
  }
}

//delete like-postID
  async deleteLikeByPostId(postId) {
  try {
    const config = this.getConfig();
    await axios.delete(`${BASE_URL}/likes/post/${postId}`, config);
  } catch (error) {
    throw new Error("Failed to delete like");
  }
}

}

export default new LikeService();