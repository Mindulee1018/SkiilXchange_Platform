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

  async getLikesByPostId(postId) {
    try {
      const config = this.getConfig();
      const response = await axios.get(`${BASE_URL}/likes/${postId}`, config);
      return response.data;
    } catch (error) {
      throw new Error("Failed to get likes by post ID");
    }
  }

 async createLike({ postId }) {
    try {
      const config = this.getConfig();
      const response = await axios.post(`${BASE_URL}/likes/${postId}`,null,config);
      /*if (response.status === 201) {
        try {
          const body = {
            userId: userId,
            message: "You have a new like",
            description: "Your post liked by " + username,
          };

          await NotificationService.createNotification(body);
        } catch (error) {}
      }*/
      return response.data;
    } catch (error) {
      throw new Error("Failed to create like");
    }
  }

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